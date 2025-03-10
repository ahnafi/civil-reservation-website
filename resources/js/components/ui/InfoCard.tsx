interface StatusCardProps {
    status: string;
    count: number;
    color: "red" | "yellow" | "green" | "blue"; // Allowed colors
}

export default function InfoCard({ status, count, color }: StatusCardProps) {
    const bgColor = {
        red: "bg-red-500",
        yellow: "bg-yellow-500",
        green: "bg-green-500",
        blue: "bg-blue-500",
    }[color];

    return (
        <div className={`p-4 rounded-lg text-white ${bgColor} shadow-md`}>
            <h3 className="text-lg font-bold">{status}</h3>
            <p className="text-2xl">{count}</p>
        </div>
    );
}
