import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { Calendar, Layers, Clock, FileText, Trash2, Check, X } from "lucide-react";

export default function ModernActivityForm({ activity, projects, monthYear, craId }) {
  const [form, setForm] = useState(() => ({
    date: activity.date 
      ? (activity.date instanceof Date ? activity.date : parseISO(activity.date))
      : null,
    project_id: activity.project_id,
    type: activity.type,
    duration: activity.duration,
    remarks: activity.remarks,
    id: activity.id,
  }));

  const [errors, setErrors] = useState({});

  const minDate = startOfMonth(parseISO(monthYear));
  const maxDate = endOfMonth(parseISO(monthYear));

  const handleFieldChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts editing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.date) newErrors.date = "Date est requise";
    if (!form.project_id) newErrors.project_id = "Projet est requis";
    if (!form.type) newErrors.type = "Type d'activité est requis";
    if (!form.duration || form.duration < 0.5) newErrors.duration = "Durée invalide";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const submission = {
      date: form.date ? format(form.date, 'yyyy-MM-dd') : null,
      project_id: form.project_id,
      type: form.type,
      duration: form.duration,
      remarks: form.remarks,
    };

    if (form.id) {
      router.put(route('activities.update', form.id), submission, {
        preserveScroll: true,
        onSuccess: () => {
          // Optional: Add toast or notification
        },
        onError: (serverErrors) => {
          setErrors(serverErrors);
        },
      });
    } else {
      router.post(route('activities.store', craId), { 
        ...submission, 
        cra_id: craId 
      }, {
        onSuccess: () => {
          // Optional: Reset form or show success message
          setForm({
            date: null,
            project_id: '',
            type: '',
            duration: '',
            remarks: ''
          });
        },
        onError: (serverErrors) => {
          setErrors(serverErrors);
        },
      });
    }
  };

  const handleDelete = () => {
    if (!form.id) return;
    
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette activité ?")) {
      router.delete(route('activities.destroy', form.id), {
        onSuccess: () => {
          // Optional: Add toast or redirect
        },
        onError: (errors) => {
          // Handle potential errors
          console.error("Erreur lors de la suppression", errors);
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white">
          {form.id ? 'Modifier l\'activité' : 'Nouvelle activité'}
        </h2>
        <div className="flex space-x-3">
          <button 
            onClick={handleSubmit} 
            className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
            title="Sauvegarder"
          >
            <Check className="w-6 h-6" />
          </button>
          {form.id && (
            <button 
              onClick={handleDelete} 
              className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="mr-2 w-5 h-5 text-indigo-600" /> Date
            </label>
            <input 
              type="date" 
              value={form.date ? format(form.date, 'yyyy-MM-dd') : ''} 
              onChange={(e) => handleFieldChange('date', new Date(e.target.value))}
              min={format(minDate, 'yyyy-MM-dd')}
              max={format(maxDate, 'yyyy-MM-dd')}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Project */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Layers className="mr-2 w-5 h-5 text-indigo-600" /> Projet
            </label>
            <select
              value={form.project_id?.toString() || ""}
              onChange={(e) => handleFieldChange('project_id', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.project_id ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un projet</option>
              {projects.map(project => (
                <option key={project.id} value={project.id.toString()}>
                  {project.name}
                </option>
              ))}
            </select>
            {errors.project_id && <p className="text-red-500 text-xs mt-1">{errors.project_id}</p>}
          </div>

          {/* Activity Type */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <FileText className="mr-2 w-5 h-5 text-indigo-600" /> Type d'activité
            </label>
            <select
              value={form.type || ""}
              onChange={(e) => handleFieldChange('type', e.target.value)}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.type ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner un type</option>
              <option value="development">Développement</option>
              <option value="research">Recherche</option>
              <option value="training">Formation</option>
              <option value="meeting">Réunion</option>
            </select>
            {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Clock className="mr-2 w-5 h-5 text-indigo-600" /> Durée (heures)
            </label>
            <input
              type="number"
              step="0.5"
              min="0.5"
              max="24"
              value={form.duration || ''}
              onChange={(e) => handleFieldChange('duration', parseFloat(e.target.value))}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                errors.duration ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
              }`}
            />
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            Remarques
          </label>
          <textarea
            value={form.remarks || ''}
            onChange={(e) => handleFieldChange('remarks', e.target.value)}
            rows={4}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
            placeholder="Ajouter des remarques supplémentaires..."
          />
        </div>
      </form>
    </div>
  );
}