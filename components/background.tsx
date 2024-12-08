'use client';

export default function Background({className}: {className?: string}) {
  return (
    <div className="absolute custom-mask top-0 left-0 w-full h-screen pointer-events-none">
      <svg 
        className="w-full h-full" 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 877 968"
        preserveAspectRatio="xMidYMid slice"
      >
        <g clipPath="url(#a)">
          <circle 
            cx="391" 
            cy="391" 
            r="390.5" 
            stroke="#22c55e" 
            transform="matrix(-1 0 0 1 416 -56)" 
          />
          <circle
            cx="468"
            cy="468"
            r="467.5"
            stroke="#22c55e"
            opacity=".3"
            transform="matrix(-1 0 0 1 493 -133)"
          />
          <circle
            cx="558"
            cy="558"
            r="557.5"
            stroke="#22c55e"
            opacity=".1"
            transform="matrix(-1 0 0 1 583 -223)"
          />
          <g filter="url(#b)">
            <ellipse
              cx="583"
              cy="229.5"
              fill="#22c55e"
              rx="583"
              ry="229.5"
              transform="matrix(-1 0 0 1 621 -9)"
            />
          </g>
          <g filter="url(#c)">
            <ellipse
              cx="262"
              cy="184.5"
              fill="#fff"
              rx="262"
              ry="184.5"
              transform="matrix(-1 0 0 1 99 42)"
            />
          </g>
        </g>
        <defs>
          <filter
            id="b"
            width="1614"
            height="907"
            x="-769"
            y="-233"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_3089_39042" stdDeviation="112" />
          </filter>
          <filter
            id="c"
            width="972"
            height="817"
            x="-649"
            y="-182"
            colorInterpolationFilters="sRGB"
            filterUnits="userSpaceOnUse"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
            <feGaussianBlur result="effect1_foregroundBlur_3089_39042" stdDeviation="112" />
          </filter>
          <clipPath id="a">
            <path fill="#fff" d="M877 0H0v968h877z" />
          </clipPath>
        </defs>
      </svg>
    </div>
  )
}
