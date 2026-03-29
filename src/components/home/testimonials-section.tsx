const testimonials = [
  {
    quote: "用了創新先生的框架，我的行銷企劃獲得老闆高度評價，直說這次的提案是三年來最好的一次。",
    author: "林小明",
    title: "品牌行銷主任",
    avatar: "林",
  },
  {
    quote: "過去覺得 AI 只是在幫我抄捷徑，看了創新先生的文章才知道，原來可以用 AI 做出真正有深度的成果。",
    author: "陳雅婷",
    title: "自由工作者",
    avatar: "陳",
  },
  {
    quote: "課程設計從來沒想過可以這樣用 AI，完課率真的提升了，學員的回饋也變好很多。",
    author: "張文俊",
    title: "線上課程講師",
    avatar: "張",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-bg2">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-[500] text-t1 mb-3">他們用創新思維做出了什麼</h2>
          <p className="text-t2 text-[15px]">真實學員的真實成果</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="rounded-xl border border-bd bg-white p-6">
              {/* Quote */}
              <div className="text-4xl text-ind-bd mb-4">"</div>
              <p className="text-[15px] text-t2 leading-relaxed mb-6">{t.quote}</p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-ind-bg flex items-center justify-center text-sm font-medium text-ind">
                  {t.avatar}
                </div>
                <div>
                  <div className="text-sm font-medium text-t1">{t.author}</div>
                  <div className="text-xs text-t3">{t.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
