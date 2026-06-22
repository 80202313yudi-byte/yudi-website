import type { ReactNode } from "react";

const SKILLS = [
  "品牌视觉",
  "AI 图像创作",
  "画册与海报",
  "产品内容设计",
  "UI 概念",
  "视频内容包装",
  "创意方向",
  "视觉叙事",
  "个人品牌系统",
];

export function Skills(): ReactNode {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
        能力方向
      </h3>
      <div className="rounded-4xl border border-foreground/5 bg-foreground/2 p-2 sm:p-4 dark:bg-foreground/5">
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-foreground/8 bg-background px-4 py-2 text-[14px] tracking-tight text-foreground/85 sm:text-[15px]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
