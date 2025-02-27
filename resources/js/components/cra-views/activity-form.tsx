import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { type Activitie, type Project } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from '@inertiajs/react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarIcon, ClockIcon, FolderIcon, MessageSquareIcon, TagIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { activityTypes, type ActivityType } from './activity-types';

const formSchema = z.object({
    date: z.date({
        required_error: 'Une date est requise',
    }),
    projet_id: z.string({
        required_error: 'Un projet est requis',
    }),
    type: z
        .enum(Object.keys(activityTypes) as [ActivityType, ...ActivityType[]], {
            required_error: 'Un type est requis',
        })
        .optional()
        .default('other'),
    duration: z
        .number({
            required_error: 'Une durée est requise',
        })
        .min(0.5, 'Minimum 30 minutes')
        .max(24, 'Maximum 24 heures'),
    remarks: z.string().optional(),
});

interface ActivityFormProps {
    activity?: Activitie;
    projects: Project[];
    monthYear: string;
    craId: number;
    onSubmit?: (activity: Activitie) => void;
    onCancel: () => void;
}

export function ModernActivityForm({ activity, projects, craId, onCancel }: ActivityFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: activity
            ? {
                  ...activity,
                  date: new Date(activity.date),
                  projet_id: activity.projet_id?.toString(),
                  type: activity.type as ActivityType,
              }
            : {
                  date: new Date(),
                  projet_id: projects[0]?.id.toString(),
                  type: 'development',
                  duration: 1,
                  remarks: '',
              },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (activity?.id) {
            router.put(route('activities.update', activity.id), values, {
                preserveScroll: true,
                preserveState: false,
            });
        } else {
            router.post(route('activities.store', craId), values, {
                preserveScroll: true,
                preserveState: false,
            });
        }
    }

    return (
        <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-blue-50 p-6 shadow-lg">
            <h2 className="mb-6 text-2xl font-semibold text-indigo-700">{activity ? 'Modifier une activité' : 'Ajouter une nouvelle activité'}</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="flex items-center font-medium text-indigo-600">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        Date
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className={cn(
                                                        'w-full border-indigo-200 pl-3 text-left font-normal transition-colors hover:border-indigo-400 hover:bg-indigo-50',
                                                        !field.value && 'text-muted-foreground',
                                                    )}
                                                >
                                                    {field.value ? (
                                                        <span className="font-medium">{format(field.value, 'P', { locale: fr })}</span>
                                                    ) : (
                                                        <span>Choisir une date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto border-indigo-200 p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                                                initialFocus
                                                className="rounded-md"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <InputError message={form.formState.errors.date?.message} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="duration"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="flex items-center font-medium text-indigo-600">
                                        <ClockIcon className="mr-2 h-4 w-4" />
                                        Durée (en heures)
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.5"
                                            min="0.5"
                                            max="24"
                                            {...field}
                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                            className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-indigo-500">
                                        Entre 0.5 et 24 heures (par tranches de 0.5)
                                    </FormDescription>
                                    <InputError message={form.formState.errors.duration?.message} />
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="projet_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center font-medium text-indigo-600">
                                    <FolderIcon className="mr-2 h-4 w-4" />
                                    Projet
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                                            <SelectValue placeholder="Sélectionner un projet" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="border-indigo-200">
                                        {projects.map((project) => (
                                            <SelectItem key={project.id} value={project.id.toString()} className="hover:bg-indigo-50">
                                                {project.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.formState.errors.projet_id?.message} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center font-medium text-indigo-600">
                                    <TagIcon className="mr-2 h-4 w-4" />
                                    Type d'activité
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500">
                                            <SelectValue placeholder="Sélectionner un type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="border-indigo-200">
                                        {Object.entries(activityTypes).map(([value, { label }]) => (
                                            <SelectItem key={value} value={value} className="hover:bg-indigo-50">
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormDescription className="text-xs text-indigo-500">
                                    Catégorisez votre activité pour un meilleur suivi
                                </FormDescription>
                                <InputError message={form.formState.errors.type?.message} />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center font-medium text-indigo-600">
                                    <MessageSquareIcon className="mr-2 h-4 w-4" />
                                    Remarques
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Ajoutez des détails sur votre activité..."
                                        className="min-h-24 border-indigo-200 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                </FormControl>
                                <InputError message={form.formState.errors.remarks?.message} />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-4 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            className="border-indigo-300 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                            Annuler
                        </Button>
                        <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-700">
                            {activity ? 'Mettre à jour' : "Ajouter l'activité"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
