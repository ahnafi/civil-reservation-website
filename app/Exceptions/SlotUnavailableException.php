<?php

namespace App\Exceptions;

use Exception;

class SlotUnavailableException extends Exception
{
    protected array $unavailableTests;

    public function __construct(array $unavailableTests)
    {
        parent::__construct('Beberapa pengujian tidak tersedia karena slot penuh.');
        $this->unavailableTests = $unavailableTests;
    }

    public function getUnavailableTests(): array
    {
        return $this->unavailableTests;
    }

    public function getDetailedMessage(): string
    {
        return 'Pengujian berikut tidak tersedia pada tanggal yang dipilih karena slot penuh: ' .
            implode(', ', $this->unavailableTests);
    }
}
