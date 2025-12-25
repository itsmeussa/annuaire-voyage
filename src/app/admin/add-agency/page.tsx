import AgencyForm from "@/components/admin/AgencyForm";

export default function AddAgencyPage() {
    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="flex flex-col gap-2 mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Add New Agency</h1>
                <p className="text-muted-foreground">
                    Manually add a new verified travel agency to the directory.
                </p>
            </div>

            <AgencyForm />
        </div>
    );
}
