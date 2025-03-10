export default function LaboratoryLogo() {
    return (
        <div className="flex items-center justify-center gap-2 md:gap-4">
            <img src="/img/logos/unsoed.png" alt="Logo Unsoed" className="w-10 md:w-12"/>
            <div className="flex flex-col">
                <p className="text-lg md:text-xl font-bold">Laboratorium Teknik Sipil</p>
                <p className="text-sm md:text-base font-normal">Universitas Jenderal Soedirman</p>
            </div>
        </div>
    )
}
