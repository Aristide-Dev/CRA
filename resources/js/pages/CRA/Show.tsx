import { CalendarView, CardsView, KanbanView, ListView, ModernActivityForm, TableView } from '@/components/cra-views';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { type Activitie, type BreadcrumbItem, type Cra, type Project } from '@/types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Calendar, Grid3X3, Layers, Layout, Plus, Table } from 'lucide-react';
import { useCallback, useState } from 'react';

type ViewComponent = typeof CalendarView | typeof CardsView | typeof KanbanView | typeof ListView | typeof TableView;

const ViewIcon = ({ view }: { view: string }) => {
    const icons = {
        calendar: Calendar,
        kanban: Layout,
        cards: Grid3X3,
        list: Layers,
        table: Table,
    };
    const Icon = icons[view as keyof typeof icons] || Calendar;
    return <Icon className="h-4 w-4" />;
};

export default function EnhancedCRAForm({ cra, projects }: { cra: Cra; projects: Project[] }) {
    const [activities, setActivities] = useState<Activitie[]>(() => {
        const sortedActivities = [...(cra.activities || [])].sort((a, b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            return dateA.getTime() - dateB.getTime();
        });
        return sortedActivities;
    });

    const [currentView, setCurrentView] = useState('cards');
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editingActivity, setEditingActivity] = useState<Activitie | null>(null);

    const handleFormSubmit = useCallback((savedActivity: Activitie) => {
        setActivities((prev) => {
            const updatedActivities = prev.map((a) => (a.id === savedActivity.id ? savedActivity : a));
            return updatedActivities.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        });
        setIsEditDialogOpen(false);
        setEditingActivity(null);
    }, []);

    const handleAdd = useCallback(() => {
        const newActivity = {
            date: new Date(),
            project_id: projects[0]?.id,
            type: 'development',
            duration: 1,
            remarks: '',
            id: null,
            cra_id: cra.id,
            cra: cra,
            project: projects[0],
        } as unknown as Activitie;

        setActivities((prev) => [...prev, newActivity].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        setIsAddDialogOpen(false);
    }, [projects, cra]);

    const handleEdit = useCallback((activity: Activitie) => {
        setEditingActivity(activity);
        setIsEditDialogOpen(true);
    }, []);

    const viewComponents: Record<string, ViewComponent> = {
        calendar: CalendarView,
        kanban: KanbanView,
        cards: CardsView,
        list: ListView,
        table: TableView,
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'CRAs', href: '#' },
    ];

    const CurrentViewComponent = viewComponents[currentView as keyof typeof viewComponents];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Card>
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-bold">
                            CRA - {format(new Date(cra.month_year || new Date()), 'MMMM yyyy', { locale: fr })}
                        </CardTitle>
                        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center space-x-2">
                            <Plus className="h-4 w-4" />
                            <span>Nouvelle activité</span>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Tabs value={currentView} onValueChange={setCurrentView} className="mb-6">
                        <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
                            {Object.keys(viewComponents).map((view) => (
                                <TabsTrigger key={view} value={view} className="flex items-center space-x-2">
                                    <ViewIcon view={view} />
                                    <span className="capitalize">{view}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                        <div className="mt-6">
                            {currentView === 'calendar' ? (
                                <CalendarView activities={activities} projects={projects} monthYear={cra.month_year} onEdit={handleEdit} />
                            ) : (
                                <CurrentViewComponent activities={activities} projects={projects} monthYear={cra.month_year} onEdit={handleEdit} />
                            )}
                        </div>
                    </Tabs>
                </CardContent>
            </Card>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Nouvelle activité</DialogTitle>
                    </DialogHeader>
                    <ModernActivityForm
                        projects={projects}
                        monthYear={cra.month_year}
                        craId={cra.id}
                        onSubmit={handleAdd}
                        onCancel={() => setIsAddDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier l'activité</DialogTitle>
                    </DialogHeader>
                    {editingActivity && (
                        <ModernActivityForm
                            activity={editingActivity}
                            projects={projects}
                            monthYear={cra.month_year}
                            craId={cra.id}
                            onSubmit={handleFormSubmit}
                            onCancel={() => setIsEditDialogOpen(false)}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
