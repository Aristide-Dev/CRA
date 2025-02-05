<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'cra_id',
        'project_id',
        'date',
        'type',
        'duration',
        'remarks',
    ];
    // Une activité appartient à un CRA
    public function cra() {
        return $this->belongsTo(Cra::class);
    }

    // Une activité est liée à un projet
    public function project() {
        return $this->belongsTo(Project::class);
    }
}
