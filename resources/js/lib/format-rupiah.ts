export const formatRupiah = (value: number, currency = "IDR") => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value)
}
