export function StepsSection() {
  const steps = [
    {
      num: "01",
      title: "學習創新思維框架",
      desc: "不只是 AI 技巧，而是底層的創新思維方法論，讓你在任何情境下都能產出差異化成果。",
      icon: "🧠",
    },
    {
      num: "02",
      title: "套用 AI 工具實戰",
      desc: "每個思維框架都搭配對應的 AI 工具實作，立刻在你的工作或創作中應用。",
      icon: "⚡",
    },
    {
      num: "03",
      title: "展示你的成果",
      desc: "上傳你的 AI 創作成果，獲得社群迴響，讓真實成果說話。",
      icon: "🏆",
    },
  ];

  return (
    <section className="py-20 bg-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-[500] text-t1 mb-3">三步驟，做出不普通成果</h2>
          <p className="text-t2 text-[15px]">系統化的學習路徑，從理解到實作到展示</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-10 left-full w-full h-px bg-ind-bd z-0 -translate-x-1/2" />
              )}

              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl bg-ind-bg border border-ind-bd flex items-center justify-center text-3xl mb-4">
                  {step.icon}
                </div>
                <div className="text-xs font-medium text-ind mb-2 tracking-wider">{step.num}</div>
                <h3 className="text-[15px] font-[500] text-t1 mb-2">{step.title}</h3>
                <p className="text-sm text-t2 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
