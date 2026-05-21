import Link from "next/link";

const FILTER_OPTIONS = [
  { label: "すべて",     value: ""               },
  { label: "作業予定",   value: "WORK_SCHEDULED" },
  { label: "作業中",     value: "WORKING"        },
  { label: "作業完了",   value: "WORK_DONE"      },
] as const;

export function StatusFilter({ current }: { current: string }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {FILTER_OPTIONS.map(({ label, value }) => {
        const active = current === value;
        return (
          <Link
            key={value}
            href={value ? `/contractor?status=${value}` : "/contractor"}
            style={{
              display:         "inline-flex",
              alignItems:      "center",
              height:          "32px",
              padding:         "0 12px",
              borderRadius:    "9999px",
              fontSize:        "12px",
              fontWeight:      500,
              textDecoration:  "none",
              backgroundColor: active ? "#1A1A1A" : "#F5F5F5",
              color:           active ? "#FFFFFF" : "#1A1A1A",
              border:          active ? "none" : "1px solid #E0E0E0",
            }}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
