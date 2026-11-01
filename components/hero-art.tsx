export function HeroArt() {
  return (
    <svg className="pencil-art" viewBox="0 0 520 390" role="img" aria-label="A hand-drawn letter and pencil illustration">
      <defs>
        <filter id="rough-pencil"><feTurbulence type="fractalNoise" baseFrequency=".75" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale=".45"/></filter>
      </defs>
      <g fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" filter="url(#rough-pencil)">
        <path className="draw-line" d="M105 86c46-22 116-24 174-16 62 8 105 31 132 61 21 24 31 55 23 88-7 29-32 50-64 62-62 23-160 22-231 2-58-16-95-48-92-93 2-43 23-78 58-104Z" opacity=".22"/>
        <path className="draw-line delay" d="M139 117c55-20 139-18 194 0 31 10 55 29 61 54 5 24-7 43-29 55-44 25-133 30-198 14-44-11-77-34-77-64 0-26 17-47 49-59Z" opacity=".45"/>
        <path className="draw-line" d="M159 146c42-13 105-15 149-3 19 5 34 14 42 25M147 169c26 37 111 52 176 32 11-3 21-8 29-13" />
        <path className="draw-line delay" d="M164 155c-4 24-2 62 2 92l-4 40 22-11 19 12 20-9 20 9 20-11 21 8 18-12 20 3 7-33"/>
        <path className="draw-line" d="M204 186c40 12 86 12 124 1M203 207c46 10 89 8 120-1M204 229c32 8 75 7 102 0" opacity=".7"/>
        <path className="draw-line delay" d="m332 245 94 79 19-22-94-79-19 22Z"/>
        <path className="draw-line" d="m332 245-12 37 31-15M426 302l9-11 10 11-10 22Z"/>
        <path className="draw-line delay" d="M94 284c-19 5-37 14-51 29M113 311c-13 13-22 26-27 41M394 84c13-12 28-21 45-25M420 103c17-7 34-10 51-8" opacity=".5"/>
        <path className="draw-line" d="M91 104c-7-9-10-20-8-31 11 1 22 7 29 17M440 187c9-7 18-10 30-10-1 11-6 20-15 27" opacity=".5"/>
      </g>
      <g fill="currentColor" opacity=".4"><circle cx="130" cy="71" r="2"/><circle cx="454" cy="130" r="2"/><circle cx="68" cy="228" r="1.8"/><circle cx="382" cy="350" r="2"/></g>
    </svg>
  );
}
