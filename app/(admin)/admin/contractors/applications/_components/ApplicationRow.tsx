import Link from "next/link";

type Contractor = {
  id:           string;
  company_name: string;
  owner_name:   string;
  phone:        string;
  areas:        string[];
  created_at:   string;
};

export function ApplicationRow({ contractor }: { contractor: Contractor }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-accent transition-colors">
      <td className="px-4 py-3 text-sm font-medium text-foreground">
        {contractor.company_name}
      </td>
      <td className="px-4 py-3 text-sm text-muted hidden sm:table-cell">
        {contractor.owner_name}
      </td>
      <td className="px-4 py-3 text-sm text-muted hidden md:table-cell">
        {contractor.phone}
      </td>
      <td className="px-4 py-3 hidden lg:table-cell">
        <span className="text-xs text-muted line-clamp-1">
          {contractor.areas.length > 0
            ? contractor.areas.slice(0, 3).join("・") + (contractor.areas.length > 3 ? "…" : "")
            : "—"}
        </span>
      </td>
      <td className="px-4 py-3 text-xs text-muted hidden sm:table-cell whitespace-nowrap">
        {new Date(contractor.created_at).toLocaleDateString("ja-JP")}
      </td>
      <td className="px-4 py-3">
        <Link
          href={`/admin/contractors/applications/${contractor.id}`}
          className="text-xs text-muted hover:text-foreground transition-colors whitespace-nowrap"
        >
          詳細を見る →
        </Link>
      </td>
    </tr>
  );
}
