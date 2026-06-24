import type { ReactNode } from "react";

type Entry = {
  school: string;
  degree: string;
  period: string;
  slug?: string;
};

const ENTRIES: Entry[] = [
  {
    school: "视觉设计实践",
    degree: "品牌、画册、海报与产品内容",
    period: "长期积累",
  },
  {
    school: "AI 图像工作流",
    degree: "提示词、筛选、后期与系列化表达",
    period: "持续迭代",
  },
  {
    school: "内容叙事研究",
    degree: "动漫、游戏、电影与未来科技",
    period: "持续关注",
  },
];

const ROW_HEIGHT = 64;

export function Education(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-foreground text-[15px] font-semibold tracking-tight">
        学习路径
      </h3>
      <div className="border-foreground/5 bg-foreground/2 dark:bg-foreground/5 relative rounded-4xl border p-2 sm:p-4">
        <ul className="flex flex-col gap-2">
          {ENTRIES.map((entry) => (
            <li
              key={`${entry.school}-${entry.period}`}
              className="bg-background border-foreground/5 flex items-center gap-4 rounded-3xl border p-2"
              style={{ minHeight: ROW_HEIGHT }}
            >
              <SchoolLogo entry={entry} />
              <div className="flex min-w-0 flex-col">
                <span className="text-foreground text-[17px] font-semibold tracking-tight sm:text-[18px]">
                  {entry.school}
                </span>
                  <span className="text-foreground/65 mt-0.5 text-[14px] tracking-tight sm:text-[15px]">
                    {entry.degree}
                    <span className="text-foreground/30 mx-2">•</span>
                    <span className="whitespace-nowrap text-foreground/55">
                      {entry.period}
                    </span>
                  </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SchoolLogo({ entry }: { entry: Entry }): ReactNode {
  const initials = entry.school.charAt(0);
  return (
    <span
      className="border-foreground/15 inline-flex h-12 w-12 shrink-0 items-center justify-center border"
      aria-hidden="true"
      style={{ borderRadius: 14 }}
    >
      {entry.slug ? (
        <img
          src={`https://cdn.simpleicons.org/${entry.slug}`}
          alt=""
          width={24}
          height={24}
          className="h-6 w-6"
          draggable={false}
        />
      ) : (
        <span className="text-foreground/60 text-[18px] font-semibold tracking-tight">
          {initials}
        </span>
      )}
    </span>
  );
}
