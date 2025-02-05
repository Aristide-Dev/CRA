<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cra extends Model
{
    protected $table = 'cras';

    
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'month_year',
        'status',
    ];

    // Un CRA appartient à un utilisateur
    public function user() {
        return $this->belongsTo(User::class);
    }

    // Un CRA a plusieurs activités
    public function activities() {
        return $this->hasMany(Activity::class);
    }
}
