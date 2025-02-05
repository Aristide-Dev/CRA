import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { format } from 'date-fns';
import ActivityForm from './Partials/ActivityForm';
import ModernLayout from "@/Layouts/ModernLayout";

export default function CRAForm({ cra, projects }) {
  const [activities, setActivities] = useState(cra?.activities || []);

  const addActivity = useCallback(() => {
    const newActivity = {
      date: new Date(),
      project_id: projects[0]?.id || '',
      type: 'development',
      duration: 1,
      remarks: '',
      id: null,
      cra_id: cra?.id
    };
    setActivities(prev => [...prev, newActivity]);
  }, [projects, cra?.id]);

  const handleSaveActivity = useCallback((updatedActivity) => {
    setActivities(prev => {
      const index = prev.findIndex(activity => 
        activity.id === updatedActivity.id || 
        (!activity.id && !updatedActivity.id && activity === prev[prev.length - 1])
      );
      
      if (index === -1) return prev;
      
      const newActivities = [...prev];
      newActivities[index] = updatedActivity;
      return newActivities;
    });
  }, []);

  const handleRemoveActivity = useCallback((activityId) => {
    setActivities(prev => prev.filter(activity => 
      activity.id !== activityId && 
      // Also remove unsaved activities that match the position
      !(activity.id === null && activity === prev[prev.length - 1])
    ));
  }, []);

  return (
    <ModernLayout className="container mx-auto max-w-4xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            Compte Rendu d'Activités - {cra?.month_year || format(new Date(), 'yyyy-MM')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {activities.map((activity, idx) => (
            <ActivityForm
            key={activity.id || idx}
            activity={activity}
            projects={projects}
            monthYear={cra.month_year}
            craId={cra.id}
            />
          ))}
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={addActivity}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Ajouter une activité
          </Button>
        </CardFooter>
      </Card>
    </ModernLayout>
  );
}