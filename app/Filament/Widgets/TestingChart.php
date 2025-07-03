<?php

namespace App\Filament\Widgets;

use App\Models\Testing;
use App\Models\Submission;
use Filament\Widgets\ChartWidget;
use Carbon\Carbon;

class TestingChart extends ChartWidget
{
    protected static ?string $heading = 'Grafik Pengujian & Pengajuan (3 Bulan Terakhir)';
    
    protected static ?int $sort = 2;
    
    protected int | string | array $columnSpan = 1;
    
    protected function getData(): array
    {
        // Get data for the last 3 months
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subMonths(3);
        
        // Create array for the last 3 months
        $months = [];
        $currentDate = $startDate->copy()->startOfMonth();
        
        while ($currentDate->lte($endDate)) {
            $months[] = $currentDate->format('M Y');
            $currentDate->addMonth();
        }
        
        // Get testing data grouped by month and status
        $testingData = Testing::selectRaw('
            DATE_FORMAT(created_at, "%b %Y") as month,
            status,
            COUNT(*) as count
        ')
        ->where('created_at', '>=', $startDate)
        ->where('created_at', '<=', $endDate)
        ->groupBy('month', 'status')
        ->orderBy('created_at')
        ->get()
        ->groupBy('month');
        
        // Get submission data for comparison
        $submissionData = Submission::selectRaw('
            DATE_FORMAT(created_at, "%b %Y") as month,
            COUNT(*) as count
        ')
        ->where('created_at', '>=', $startDate)
        ->where('created_at', '<=', $endDate)
        ->groupBy('month')
        ->orderBy('created_at')
        ->get()
        ->keyBy('month');
        
        // Prepare data for chart
        $completedData = [];
        $ongoingData = [];
        $submissionsData = [];
        
        foreach ($months as $month) {
            $monthTestingData = $testingData->get($month, collect());
            
            $completedData[] = $monthTestingData->where('status', 'completed')->sum('count');
            $ongoingData[] = $monthTestingData->where('status', 'testing')->sum('count');
            $submissionsData[] = $submissionData->get($month)?->count ?? 0;
        }
        
        return [
            'datasets' => [
                [
                    'label' => 'Pengujian Selesai',
                    'data' => $completedData,
                    'backgroundColor' => 'rgba(34, 197, 94, 0.2)', // green
                    'borderColor' => 'rgba(34, 197, 94, 1)',
                    'borderWidth' => 2,
                    'fill' => true,
                ],
                [
                    'label' => 'Sedang Pengujian',
                    'data' => $ongoingData,
                    'backgroundColor' => 'rgba(59, 130, 246, 0.2)', // blue
                    'borderColor' => 'rgba(59, 130, 246, 1)',
                    'borderWidth' => 2,
                    'fill' => true,
                ],
                [
                    'label' => 'Total Pengajuan',
                    'data' => $submissionsData,
                    'backgroundColor' => 'rgba(168, 85, 247, 0.2)', // purple
                    'borderColor' => 'rgba(168, 85, 247, 1)',
                    'borderWidth' => 2,
                    'fill' => false,
                    'type' => 'line',
                ],
            ],
            'labels' => $months,
        ];
    }
    
    protected function getType(): string
    {
        return 'line';
    }
    
    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                    'position' => 'top',
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'ticks' => [
                        'stepSize' => 1,
                    ],
                ],
            ],
            'responsive' => true,
            'maintainAspectRatio' => false,
        ];
    }
}
