import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { fr } from 'date-fns/locale';
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Layers, Clock, FileText, Trash2, Check, X } from "lucide-react";

// Enregistrer la locale française
registerLocale('fr', fr);

export default function ModernActivityForm({ activity, projects, monthYear, craId }) {
  const minDate = startOfMonth(parseISO(monthYear));
  const maxDate = endOfMonth(parseISO(monthYear));

  // S'assurer que la date initiale est un objet Date valide
  const getInitialDate = () => {
    if (activity.date) {
      const date = new Date(activity.date);
      return date < minDate || date > maxDate ? minDate : date;
    }
    return minDate; // Par défaut, premier jour du mois
  };

  const [form, setForm] = useState(() => ({
    date: getInitialDate(),
    project_id: activity.project_id,
    type: activity.type,
    duration: activity.duration,
    remarks: activity.remarks,
    id: activity.id || null,
  }));

  const [errors, setErrors] = useState({});

  const handleFieldChange = (field, value) => {
    if (field === 'date') {
      if (value && value >= minDate && value <= maxDate) {
        setForm(prev => ({
          ...prev,
          date: value
        }));
        if (errors.date) {
          setErrors(prev => ({ ...prev, date: undefined }));
        }
      } else {
        setErrors(prev => ({
          ...prev,
          date: "La date doit être dans le mois du CRA"
        }));
      }
    } else {
      setForm(prev => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors(prev => ({ ...prev, [field]: undefined }));
      }
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
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Date avec DatePicker */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center">
              <Calendar className="mr-2 w-5 h-5 text-indigo-600" /> Date
            </label>
            <div className="relative">
              <DatePicker
                selected={form.date}
                onChange={(date) => handleFieldChange('date', date)}
                dateFormat="dd/MM/yyyy"
                locale="fr"
                minDate={minDate}
                maxDate={maxDate}
                placeholderText="Sélectionner une date"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                  errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                }`}
                calendarClassName="bg-white border border-gray-200 rounded-lg shadow-lg"
                popperPlacement="bottom-start"
                showPopperArrow={false}
                popperModifiers={[
                  {
                    name: 'offset',
                    options: {
                      offset: [0, 8],
                    },
                  },
                ]}
                customInput={
                  <input
                    type="text"
                    className={`w-full px-4 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 transition-all ${
                      errors.date ? 'border-red-500 focus:ring-red-500' : 'border-gray-300'
                    }`}
                  />
                }
              />
              <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">
                {errors.date === "Date est requise" 
                  ? errors.date 
                  : "La date doit être comprise entre le " + 
                    format(minDate, 'dd/MM/yyyy') + 
                    " et le " + 
                    format(maxDate, 'dd/MM/yyyy')}
              </p>
            )}
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

        <div className="flex justify-end space-x-4 mt-6">
          {form.id && (
            <button 
              onClick={handleDelete} 
              type="button"
              className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 bg-white hover:bg-red-50 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              title="Supprimer l'activité"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Supprimer
            </button>
          )}
          <button 
            onClick={handleSubmit}
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            title="Sauvegarder l'activité"
          >
            <Check className="w-5 h-5 mr-2" />
            Sauvegarder
          </button>
        </div>
      </form>
    </div>
  );
}