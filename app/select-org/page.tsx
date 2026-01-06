import { OrganizationList } from "@clerk/nextjs";

export default function SelectOrgPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <OrganizationList
        hidePersonal
        afterSelectOrganizationUrl="/dashboard" 
        afterCreateOrganizationUrl="/dashboard"
      />
    </div>
  );
}