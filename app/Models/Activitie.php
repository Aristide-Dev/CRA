<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activitie extends Model
{
    /** @use HasFactory<\Database\Factories\ActivitieFactory> */
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'cra_id',
        'projet_id',
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
        return $this->belongsTo(Projet::class, 'projet_id');
    }
}