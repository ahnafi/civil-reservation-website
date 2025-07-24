<?php

namespace App\Http\Requests;

use Illuminate\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use App\Models\Test;
use App\Models\Package;
use App\Models\Schedule;

class SubmitSubmissionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [

            'submission_type' => ['required', 'in:internal,external'],

            // Field khusus external
            'company_name' => ['required_if:submission_type,external'],
            'project_name' => ['required_if:submission_type,external'],
            'project_address' => ['required_if:submission_type,external'],

            // Field khusus internal
            'name' => ['required_if:submission_type,internal'],
            'program_study' => ['required_if:submission_type,internal'],
            'research_title' => ['required_if:submission_type,internal'],
            'personnel_count' => ['nullable', 'integer'],
            'supervisor' => ['nullable', 'string'],

            // Umum
            'test_submission_date' => ['required', 'date'],
            'submission_tests' => ['required', 'array'],
            'submission_packages' => ['nullable', 'array'],
            'user_note' => ['nullable', 'string'],
            'admin_note' => ['nullable', 'string'],
            // 'documents' => ['nullable', 'array'],
            'documents' => ['nullable'],
            'documents.*' => ['file', 'max:2048', 'mimes:pdf,doc,docx,png,jpg,jpeg'],

            // submission_tests is required if submission_packages is not present
            'submission_tests' => 'required_without:submission_packages|array',
            'submission_tests.*.test_id' => 'required|exists:tests,id',
            'submission_tests.*.unit' => 'required|integer',

            // submission_packages is required if submission_tests is not present
            'submission_packages' => 'required_without:submission_tests|array',
            'submission_packages.*.package_id' => 'required|exists:packages,id',
        ];
    }

    public function messages(): array
    {
        return [
            'submission_type.required' => 'Jenis pengajuan wajib diisi.',

            'company_name.required_if' => 'Nama perusahaan wajib diisi.',
            'project_name.required_if' => 'Nama proyek wajib diisi.',
            'project_address.required_if' => 'Alamat proyek wajib diisi.',

            'name.required_if' => 'Nama pengusul wajib diisi.',
            'program_study.required_if' => 'Program studi wajib diisi.',
            'research_title.required_if' => 'Judul penelitian wajib diisi.',

            'test_submission_date.required' => 'Tanggal pengajuan pengujian wajib diisi.',
            'test_submission_date.date' => 'Format tanggal pengajuan uji tidak valid.',
            'documents.*.max' => 'Ukuran setiap file dokumen tidak boleh lebih dari 2MB.',
            'documents.*.file' => 'Setiap lampiran harus berupa file yang valid.',
            'documents.*.mimes' => 'Format file tidak diperbolehkan. Hanya boleh mengunggah: PDF, DOC, DOCX, JPG, PNG.',

            'submission_tests.required_without' => 'Minimal satu pengujian atau paket harus dipilih.',
            'submission_tests.array' => 'Format data pengujian tidak valid.',
            'submission_tests.*.test_id.required' => 'Jenis pengujian wajib diisi.',
            'submission_tests.*.test_id.exists' => 'Jenis pengujian tidak ditemukan.',
            'submission_tests.*.unit.required' => 'Jumlah unit pengujian wajib diisi.',
            'submission_tests.*.unit.integer' => 'Jumlah unit pengujian harus berupa angka.',

            'submission_packages.required_without' => 'Minimal satu paket atau pengujian harus dipilih.',
            'submission_packages.array' => 'Format data paket tidak valid.',
            'submission_packages.*.package_id.required' => 'Paket pengujian wajib diisi.',
            'submission_packages.*.package_id.exists' => 'Paket pengujian tidak ditemukan.',
        ];
    }


    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            // Validation if unit is less than minimum unit for each test
            $tests = $this->input('submission_tests', []);

            $testIds = collect($tests)->pluck('test_id')->filter()->toArray();

            $loadedTests = Test::with('category')->whereIn('id', $testIds)->get()->keyBy('id');

            foreach ($tests as $index => $submissionTest) {
                $test = $loadedTests->get($submissionTest['test_id'] ?? null);

                if ($test && isset($submissionTest['unit'])) {
                    if ($submissionTest['unit'] < $test->minimum_unit) {
                        $validator->errors()->add(
                            "submission_tests.$index.unit",
                            "Jumlah pengajuan untuk pengujian {$test->name} tidak boleh kurang dari {$test->minimum_unit} {$test->category->name}"
                        );
                    }
                }
            }

            $testSubmissionDate = $this->input('test_submission_date');
            $packageIds = $this->input('submission_packages', []);
            $packageTestIds = Package::whereIn('id', $packageIds)
                ->with('tests:id')
                ->get()
                ->pluck('tests')
                ->flatten()
                ->pluck('id')
                ->unique()
                ->values();
            $mergeTestIds = collect($testIds)->merge($packageTestIds)->unique()->values()->toArray();

            // validation if test_submission_date is in the past
            if ($testSubmissionDate && strtotime($testSubmissionDate) < time()) {
                $validator->errors()->add('test_submission_date', 'Tanggal pengajuan uji tidak boleh di masa lalu.');
            }


            // validation if test_submission_date schedule has full slots
            $fullSlotSchedules = Schedule::whereIn('test_id', $mergeTestIds)
                ->where('date', $testSubmissionDate)
                ->where('available_slots', 0)
                ->get();

            if ($fullSlotSchedules->isNotEmpty()) {
                $fullNames = $fullSlotSchedules->map(function ($schedule) {
                    return $schedule->test->name ?? "ID {$schedule->test_id}";
                })->implode(', ');

                $validator->errors()->add(
                    'test_submission_date',
                    "Slot untuk pengujian berikut penuh pada tanggal ini. Silakan pilih tanggal lain: $fullNames."
                );
            }
        });
    }

    public function attributes(): array
    {
        return [
            'test_submission_date' => 'Tanggal pengajuan uji',
            'submission_tests.*.unit' => 'Jumlah unit pengujian',
            'submission_tests.*.test_id' => 'Jenis pengujian',
            'submission_packages.*.package_id' => 'Paket pengujian',
        ];
    }
}
