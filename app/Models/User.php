<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Http\Request;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'identity',
        'role',
        'photo'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */

    protected static function boot(): void
    {
        parent::boot();

        static::created(function ($user) {
            if ($user->email) {
                $email = strtolower($user->email);

                if (str_ends_with($email, 'unsoed.ac.id') || str_ends_with($email, '@mhs.unsoed.ac.id')) {
                    $user->role = 'internal';
                    $user->save();
                } else {
                    $user->role = 'external';
                    $user->save();
                }
            }
        });
    }


    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'identity' => 'encrypted',
            'phone' => 'encrypted'
        ];
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(Submission::class);
    }

    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        return $this->role == "admin";
    }

}
