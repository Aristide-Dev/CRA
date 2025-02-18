import React, { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Layout, Layers, Grid3X3, Table, Plus, X } from "lucide-react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { fr } from 'date-fns/locale';
import ModernActivityForm from './Partials/ModernActivityForm';
import ModernLayout from '@/Layouts/ModernLayout';



const ViewIcon = ({ view }) => {
  const icons = {
    calendar: Calendar,
    kanban: Layout,
    cards: Grid3X3,
    list: Layers,
    table: Table
  };
  const Icon = icons[view] || Calendar;
  return <Icon className="w-4 h-4" />;
};

const ActivityBadge = ({ type }) => {
  const colors = {
    development: 'bg-blue-100 text-blue-800',
    research: 'bg-purple-100 text-purple-800',
    training: 'bg-green-100 text-green-800',
    meeting: 'bg-orange-100 text-orange-800'
  };

  const labels = {
    development: 'Développement',
    research: 'Recherche',
    training: 'Formation',
    meeting: 'Réunion'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[type] || 'bg-gray-100 text-gray-800'}`}>
      {labels[type] || type}
    </span>
  );
};

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-0 sm:p-4">
    <div className="relative bg-transparent md:max-w-full w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-auto sm:max-w-3xl sm:rounded-lg shadow-xl overflow-hidden">
      {/* Bouton de fermeture */}
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 z-50 bg-white/50 backdrop-blur-sm p-2 rounded-full hover:bg-red-600/20 transition-colors"
        aria-label="Fermer la modal"
      >
        <X className="w-6 h-6 text-red-500 sm:text-red-600" />
      </button>

      {/* Contenu scrollable */}
      <div className="h-full sm:h-auto overflow-y-auto">
        <div className="p-4 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const CalendarView = ({ activities, projects, monthYear, craId, onEdit }) => {
  const parsedMonthYear = typeof monthYear === 'string' ? monthYear : format(new Date(), 'yyyy-MM-dd');
  
  // Obtenir le premier jour du mois
  const startDate = startOfMonth(parseISO(parsedMonthYear));
  // Reculer jusqu'au lundi précédent si nécessaire
  const calendarStart = startOfWeek(startDate, { weekStartsOn: 1 });
  // Obtenir le dernier jour du mois
  const endDate = endOfMonth(parseISO(parsedMonthYear));
  // Avancer jusqu'au dimanche suivant si nécessaire
  const calendarEnd = endOfWeek(endDate, { weekStartsOn: 1 });
  
  // Générer tous les jours du calendrier
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  
  const safeParseISO = (dateString) => {
    if (!dateString) return null;
    if (dateString instanceof Date) return dateString;
    try {
      return parseISO(dateString);
    } catch (error) {
      console.error("Erreur lors du parsing de la date :", dateString, error);
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* En-tête des jours de la semaine */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
        {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
          <div key={day} className="bg-gray-50 p-2 text-center text-sm font-medium text-gray-500">
            {day}
          </div>
        ))}
      </div>
      {/* Grille des jours */}
      <div className="grid grid-cols-7 gap-px bg-gray-200">
        {days.map(day => {
          const dayActivities = activities.filter(activity => {
            const parsedDate = safeParseISO(activity.date);
            if (!parsedDate) return false;
            return isSameDay(parsedDate, day);
          });
          const isCurrentMonth = isSameMonth(day, parseISO(parsedMonthYear));
          
          return (
            <div 
              key={day.toISOString()} 
              className={`bg-white min-h-32 p-2 ${!isCurrentMonth ? 'bg-gray-50' : ''}`}
            >
              <div className={`text-sm ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {format(day, 'd')}
              </div>
              <div className="mt-1 space-y-1">
                {dayActivities.map(activity => (
                  <div
                    key={activity.id}
                    onClick={() => onEdit(activity)}
                    className="text-xs p-2 rounded bg-indigo-100 text-indigo-700 hover:bg-indigo-200 cursor-pointer transition-colors"
                  >
                    <div className="font-medium truncate">
                      {projects.find(p => p.id.toString() === activity.project_id?.toString())?.name || 'Projet inconnu'}
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <ActivityBadge type={activity.type} />
                      <span>{activity.duration}h</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const KanbanView = ({ activities, projects, monthYear, craId, onEdit }) => {
  const columns = {
    'À faire': activities.filter(a => !a.status),
    'En cours': activities.filter(a => a.status === 'in_progress'),
    'Terminé': activities.filter(a => a.status === 'completed')
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(columns).map(([title, items]) => (
        <div key={title} className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-medium text-gray-900 mb-4">{title}</h3>
          <div className="space-y-3">
            {items.map(activity => (
              <div 
                key={activity.id} 
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => onEdit(activity)}
              >
                <div className="flex justify-between items-start mb-2">
                  <ActivityBadge type={activity.type} />
                  <span className="text-sm text-gray-500">
                    {activity.duration}h
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {projects.find(p => p.id.toString() === activity.project_id?.toString())?.name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {format(new Date(activity.date), 'PPP', { locale: fr })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const CardsView = ({ activities, projects, monthYear, craId, onEdit }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {activities.map(activity => (
      <div 
        key={activity.id} 
        className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-200 cursor-pointer"
        onClick={() => onEdit(activity)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <ActivityBadge type={activity.type} />
            <span className="text-2xl font-semibold text-gray-900">
              {activity.duration}h
            </span>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {projects.find(p => p.id.toString() === activity.project_id?.toString())?.name}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {format(new Date(activity.date), 'PPP', { locale: fr })}
          </p>
          {activity.remarks && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {activity.remarks}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

const ListView = ({ activities, projects, monthYear, craId, onEdit }) => (
  <div className="space-y-4">
    {activities.map(activity => (
      <div 
        key={activity.id}
        className="bg-white rounded-lg shadow hover:shadow-md transition-all duration-200 cursor-pointer"
        onClick={() => onEdit(activity)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-lg font-medium text-gray-900">
                {projects.find(p => p.id.toString() === activity.project_id?.toString())?.name}
              </p>
              <p className="text-sm text-gray-500">
                {format(new Date(activity.date), 'PPP', { locale: fr })}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <ActivityBadge type={activity.type} />
              <span className="text-lg font-semibold text-gray-900">
                {activity.duration}h
              </span>
            </div>
          </div>
          {activity.remarks && (
            <p className="mt-4 text-sm text-gray-600">
              {activity.remarks}
            </p>
          )}
        </div>
      </div>
    ))}
  </div>
);

const TableView = ({ activities, projects, monthYear, craId, onEdit }) => (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Date
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Projet
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Type
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Durée
          </th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Remarques
          </th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {activities.map(activity => (
          <tr 
            key={activity.id}
            className="hover:bg-gray-50 cursor-pointer"
            onClick={() => onEdit(activity)}
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {format(new Date(activity.date), 'P', { locale: fr })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {projects.find(p => p.id.toString() === activity.project_id?.toString())?.name}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <ActivityBadge type={activity.type} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {activity.duration}h
            </td>
            <td className="px-6 py-4 text-sm text-gray-500">
              {activity.remarks || '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default function EnhancedCRAForm({ cra, projects }) {
  // Tri des activités par date
  const [activities, setActivities] = useState(() => {
    const sortedActivities = [...(cra.activities || [])].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    });
    return sortedActivities;
  });

  const [currentView, setCurrentView] = useState('cards');
  const [editingActivity, setEditingActivity] = useState(null);

  const handleFormSubmit = useCallback((savedActivity) => {
    setActivities(prev => {
      const updatedActivities = prev.map(a => 
        a.id === savedActivity.id ? savedActivity : a
      );
      // Tri des activités après mise à jour
      return updatedActivities.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateA - dateB;
      });
    });
    setEditingActivity(null);
  }, []);

  const addActivity = useCallback(() => {
    const newActivity = {
      date: new Date(),
      project_id: projects[0]?.id || '',
      type: 'development',
      duration: 1,
      remarks: '',
      id: null,
      cra_id: cra.id,
    };
    
    // Ajout et tri immédiat
    setActivities(prev => [...prev, newActivity].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA - dateB;
    }));
    setEditingActivity(newActivity);
  }, [projects, cra.id]);

  const viewComponents = {
    calendar: CalendarView,
    kanban: KanbanView,
    cards: CardsView,
    list: ListView,
    table: TableView
  };

  const CurrentViewComponent = viewComponents[currentView];

  return (
    <ModernLayout className="container mx-auto py-6 px-4">
      <Card>
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              CRA - {format(new Date(cra.month_year || new Date()), 'MMMM yyyy', { locale: fr })}
            </CardTitle>
            <Button 
              onClick={addActivity}
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle activité</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={currentView} onValueChange={setCurrentView} className="mb-6">
            <TabsList className="grid grid-cols-5 gap-4 bg-transparent">
              {Object.keys(viewComponents).map(view => (
                <TabsTrigger
                  key={view}
                  value={view}
                  className="flex items-center space-x-2"
                >
                  <ViewIcon view={view} />
                  <span className="capitalize">{view}</span>
                </TabsTrigger>
              ))}
            </TabsList>
            <div className="mt-6">
              <CurrentViewComponent
                activities={activities}
                projects={projects}
                monthYear={cra.month_year}
                craId={cra.id}
                onEdit={setEditingActivity}
              />
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {editingActivity && (
        <Modal onClose={() => setEditingActivity(null)}>
          <div className="bg-white sm:rounded-lg">
            <ModernActivityForm
              activity={editingActivity}
              projects={projects}
              monthYear={cra.month_year}
              craId={cra.id}
              onSubmit={handleFormSubmit}
              onCancel={() => setEditingActivity(null)}
            />
          </div>
        </Modal>
      )}
    </ModernLayout>
  );
}