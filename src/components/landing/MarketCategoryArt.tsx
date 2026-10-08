import { useId } from "react";
type Props = { tone: string };
type CoinProps = { x: number; y: number; radius: number; face: string; edge: string; ink: string; symbol: string; rotation?: number };
function Coin({x,y,radius,face,edge,ink,symbol,rotation=0}:CoinProps) {
  return <g transform={"translate("+x+" "+y+") rotate("+rotation+")"}>
    <circle cy="5" r={radius} fill={edge}/><circle r={radius} fill={face} stroke={edge} strokeWidth="1.5"/>
    <circle r={radius-5} fill="none" stroke={ink} strokeOpacity=".18"/>
    <circle r={radius-8} fill="none" stroke="#fff" strokeOpacity=".2" strokeDasharray="1 4"/>
    <path d={"M "+(-radius*.68)+" "+(-radius*.5)+" A "+(radius-4)+" "+(radius-4)+" 0 0 1 "+(radius*.5)+" "+(-radius*.7)} fill="none" stroke="#fff" strokeOpacity=".65" strokeWidth="2" strokeLinecap="round"/>
    <text textAnchor="middle" dominantBaseline="central" y="1" fill={ink} fontSize={radius*1.3} fontFamily="Arial, sans-serif" fontWeight="700">{symbol}</text>
  </g>;
}
/* Illustrations for the market category cards, drawn for a light card.
   Metal and coin colours depict the assets themselves; glows and shadows use
   the brand palette (navy #0D315E, ocean #0879AD, turquoise #17ADB4). */
export default function MarketCategoryArt({tone}:Props) {
  const uniqueId=useId().replace(/:/g,"");
  const id=(name:string)=>uniqueId+"-market-"+name;
  const paint=(name:string)=>"url(#"+id(name)+")";
  const market=tone.toLowerCase();
  return <svg className="market-category-art" viewBox="0 0 260 174" width="100%" height="100%" fill="none" aria-hidden="true" focusable="false">
    <defs>
      <linearGradient id={id("ivory")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFFFFF"/><stop offset=".48" stopColor="#D6E2EA"/><stop offset="1" stopColor="#849BAC"/></linearGradient>
      <linearGradient id={id("slate")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#A3BBCD"/><stop offset=".45" stopColor="#66839B"/><stop offset="1" stopColor="#2D4961"/></linearGradient>
      <linearGradient id={id("gold")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFF0AF"/><stop offset=".36" stopColor="#EBCB70"/><stop offset=".65" stopColor="#B9842F"/><stop offset="1" stopColor="#E3B552"/></linearGradient>
      <linearGradient id={id("copper")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFD991"/><stop offset=".42" stopColor="#F3A541"/><stop offset="1" stopColor="#B66320"/></linearGradient>
      <linearGradient id={id("bar-top")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#FFF3B8"/><stop offset=".4" stopColor="#DBB358"/><stop offset=".7" stopColor="#FFE3A0"/><stop offset="1" stopColor="#C89535"/></linearGradient>
      <linearGradient id={id("bar-front")} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#D5AB52"/><stop offset="1" stopColor="#8D6124"/></linearGradient>
      <linearGradient id={id("blue")} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#7CC5FF"/><stop offset=".42" stopColor="#3177E4"/><stop offset="1" stopColor="#174190"/></linearGradient>
      <linearGradient id={id("cyan")} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#318FB3"/><stop offset=".5" stopColor="#88EAF4"/><stop offset="1" stopColor="#DEFCFF"/></linearGradient>
      <linearGradient id={id("chart-area")} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#67DBEF" stopOpacity=".3"/><stop offset="1" stopColor="#67DBEF" stopOpacity="0"/></linearGradient>
      <radialGradient id={id("blue-glow")}><stop stopColor="#0879AD" stopOpacity=".16"/><stop offset="1" stopColor="#0879AD" stopOpacity="0"/></radialGradient>
      <radialGradient id={id("gold-glow")}><stop stopColor="#17ADB4" stopOpacity=".14"/><stop offset="1" stopColor="#17ADB4" stopOpacity="0"/></radialGradient>
      <radialGradient id={id("planet")} cx=".3" cy=".2" r=".9"><stop stopColor="#294D66"/><stop offset=".55" stopColor="#15374E"/><stop offset="1" stopColor="#091A2B"/></radialGradient>
      <linearGradient id={id("skyline")} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#4B8BB3" stopOpacity=".55"/><stop offset="1" stopColor="#1A3C58" stopOpacity=".05"/></linearGradient>
    </defs>
    {market==="forex" && <>
      <ellipse cx="132" cy="99" rx="119" ry="72" fill={paint("blue-glow")}/><ellipse cx="127" cy="147" rx="80" ry="10" fill="#0D315E" fillOpacity=".1"/>
      <Coin x={77} y={95} radius={38} face={paint("slate")} edge="#28465F" ink="#DFEDF7" symbol="€" rotation={-16}/>
      <Coin x={133} y={71} radius={46} face={paint("ivory")} edge="#6C879B" ink="#294259" symbol="$" rotation={12}/>
      <Coin x={184} y={107} radius={35} face={paint("gold")} edge="#896027" ink="#755224" symbol="£" rotation={18}/>
      <path d="M32 113C38 96 39 69 63 52" stroke="#B8D7EA" strokeOpacity=".15" strokeLinecap="round"/><circle cx="212" cy="58" r="2" fill="#B9D4E6" fillOpacity=".5"/><circle cx="49" cy="43" r="1.5" fill="#D9C183" fillOpacity=".7"/>
    </>}
    {market==="crypto" && <>
      <ellipse cx="132" cy="97" rx="110" ry="72" fill={paint("gold-glow")}/><ellipse cx="133" cy="146" rx="78" ry="11" fill="#0D315E" fillOpacity=".1"/>
      <g transform="translate(69 115) rotate(-19)"><ellipse cy="9" rx="31" ry="15" fill="#885324"/><ellipse cy="5" rx="31" ry="15" fill="#C08839"/><ellipse rx="31" ry="15" fill={paint("gold")} stroke="#E6BC67"/><ellipse rx="24" ry="10" stroke="#8C602B" strokeOpacity=".6"/><path d="M-18 9V13M-11 13V17M-3 15V19M5 15V19M13 13V17M21 10V14" stroke="#F1C875" strokeOpacity=".65"/></g>
      <Coin x={156} y={91} radius={49} face={paint("copper")} edge="#97571F" ink="#FFF1CD" symbol="₿" rotation={18}/>
      <Coin x={103} y={70} radius={33} face={paint("gold")} edge="#99662C" ink="#9A6A26" symbol="₿" rotation={-21}/>
      <path d="M174 35L180 29M196 47L204 44M204 69H212" stroke="#E7B85E" strokeOpacity=".45" strokeLinecap="round"/><circle cx="45" cy="62" r="2" fill="#ECCB84" fillOpacity=".55"/>
    </>}
    {market==="commodities" && <>
      <ellipse cx="130" cy="106" rx="109" ry="66" fill={paint("gold-glow")}/><ellipse cx="133" cy="148" rx="83" ry="9" fill="#0D315E" fillOpacity=".1"/>
      <g><path d="M41 113L129 91L177 115L90 139Z" fill={paint("bar-top")} stroke="#EDC975" strokeWidth=".8"/><path d="M41 113L90 139V153L43 128Z" fill="#8C652B"/><path d="M90 139L177 115L175 129L90 153Z" fill={paint("bar-front")}/><path d="M50 112L91 133L164 114" stroke="#FFF0B0" strokeOpacity=".45"/></g>
      <g><path d="M96 98L182 76L225 99L141 123Z" fill={paint("bar-top")} stroke="#F1D185" strokeWidth=".8"/><path d="M96 98L141 123V139L97 113Z" fill="#946B2D"/><path d="M141 123L225 99L223 114L141 139Z" fill={paint("bar-front")}/><path d="M106 97L142 117L211 98" stroke="#FFF3C2" strokeOpacity=".5"/></g>
      <g><path d="M71 67L154 47L201 70L118 94Z" fill={paint("bar-top")} stroke="#F3D991"/><path d="M71 67L118 94V113L72 87Z" fill="#AB7D35"/><path d="M118 94L201 70L199 89L118 113Z" fill={paint("bar-front")}/><path d="M79 68L118 88L190 69" stroke="#FFF7D6" strokeOpacity=".7"/><path d="M108 66L130 60L151 70L129 76Z" stroke="#9E762F" strokeOpacity=".45"/><path d="M119 67L132 64L141 69L129 72Z" fill="#B68A3C" fillOpacity=".45"/></g>
      <path d="M204 46V55M199.5 50.5H208.5" stroke="#F2D58C" strokeOpacity=".65" strokeLinecap="round"/>
    </>}
    {market==="stocks" && <>
      <ellipse cx="132" cy="98" rx="111" ry="73" fill={paint("blue-glow")}/><ellipse cx="130" cy="150" rx="82" ry="10" fill="#0D315E" fillOpacity=".1"/>
      <path d="M37 140L85 153L129 137L82 124Z" fill="#0D315E" fillOpacity=".1"/><path d="M47 63L85 46L113 62L76 80Z" fill="#EDF7FF"/><path d="M47 63L76 80V139L47 123Z" fill="#A3BBCF"/><path d="M76 80L113 62V123L76 139Z" fill={paint("ivory")}/>
      {[0,1,2].map(column=><g key={column}>{[0,1,2,3].map(row=><path key={row} d={"M "+(83+column*9)+" "+(83+row*11-column*4.3)+" l 5 -2.4 v 5.5 l -5 2.4 Z"} fill="#416D91" fillOpacity=".75"/>)}</g>)}
      {[0,1,2,3].map(row=><path key={row} d={"M53 "+(77+row*11)+"l14 8v5l-14-8Z"} fill="#5F809B" fillOpacity=".65"/>)}
      <g transform="translate(147 87) rotate(13)"><rect x="-30" y="-32" width="67" height="69" rx="17" fill="#174287" transform="translate(3 7)"/><rect x="-32" y="-35" width="67" height="69" rx="17" fill={paint("blue")} stroke="#8ED6FF" strokeOpacity=".4"/><path d="M-20-19H-2V-1H-20ZM6-19H24V-1H6ZM-20 7H-2V25H-20ZM6 7H24V25H6Z" fill="#EEF8FF" fillOpacity=".94"/><path d="M-19-28H7" stroke="#C3E7FF" strokeOpacity=".55" strokeLinecap="round"/></g>
      <g transform="translate(182 127) rotate(-10)"><rect x="-19" y="-19" width="42" height="39" rx="10" fill="#1E4D81" stroke="#649BBE" strokeOpacity=".4"/><path d="M-9 8V1M0 8V-5M9 8V-11" stroke="#AED7F0" strokeWidth="5" strokeLinecap="round"/></g>
    </>}
    {market==="indices" && <>
      <ellipse cx="132" cy="94" rx="118" ry="72" fill={paint("blue-glow")}/>
      <g stroke="#619FC3" strokeOpacity=".15"><circle cx="139" cy="80" r="48"/><ellipse cx="139" cy="80" rx="22" ry="48"/><path d="M94 65C121 79 157 79 184 65M94 96C121 82 157 82 184 96M91 80H187"/></g>
      <path d="M36 137V105H49V91H64V115H75V75H90V103H101V86H115V121H127V67H143V102H154V81H166V54H179V106H191V87H205V137Z" fill={paint("skyline")}/>
      <path d="M36 137H222" stroke="#5591B1" strokeOpacity=".25"/><path d="M36 121L62 113L86 119L112 91L138 102L163 70L187 80L217 44V138H36Z" fill={paint("chart-area")}/>
      <path d="M36 121L62 113L86 119L112 91L138 102L163 70L187 80L217 44" stroke="#55CAE5" strokeWidth="9" strokeOpacity=".09" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M36 121L62 113L86 119L112 91L138 102L163 70L187 80L217 44" stroke={paint("cyan")} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx="112" cy="91" r="3" fill="#BDF5FF"/><circle cx="163" cy="70" r="3" fill="#BDF5FF"/><circle cx="217" cy="44" r="4" fill="#D8FBFF"/><circle cx="217" cy="44" r="9" stroke="#9FEAF7" strokeOpacity=".25"/><path d="M202 44H217V59" stroke="#C5F6FE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </>}
    {market==="otc" && <>
      <ellipse cx="132" cy="92" rx="113" ry="76" fill={paint("blue-glow")}/><ellipse cx="119" cy="149" rx="66" ry="9" fill="#0D315E" fillOpacity=".1"/>
      <circle cx="111" cy="87" r="46" fill={paint("planet")} stroke="#59859D" strokeOpacity=".45"/>
      <g stroke="#70B2C4" strokeOpacity=".27"><ellipse cx="111" cy="87" rx="22" ry="46"/><ellipse cx="111" cy="87" rx="37" ry="46"/><path d="M67 75C88 87 133 87 155 75M67 98C88 86 133 86 155 98M76 59C94 69 127 69 146 59M76 115C94 105 127 105 146 115M65 87H157"/></g>
      <path d="M76 57C85 46 100 41 113 42" stroke="#98DBE7" strokeOpacity=".5" strokeWidth="2" strokeLinecap="round"/><ellipse cx="111" cy="89" rx="75" ry="23" transform="rotate(-24 111 89)" stroke="#6DCBDD" strokeOpacity=".18" strokeWidth="6"/>
      <path d="M43 114C45 126 79 124 119 106C160 88 186 63 179 53" stroke={paint("cyan")} strokeWidth="2" strokeLinecap="round"/><circle cx="43" cy="114" r="3" fill="#A4EAF2"/>
      <path d="M183 27C166 27 155 38 155 51C155 63 165 73 178 75C165 79 149 71 145 58C140 42 149 27 164 24C172 22 178 23 183 27Z" fill={paint("gold")}/>
      <g transform="translate(181 116) rotate(12)"><circle cy="4" r="29" fill="#17374A"/><circle r="29" fill={paint("ivory")} stroke="#7997AB"/><circle r="23" fill="#173C51" stroke="#9CCADA" strokeOpacity=".5"/><path d="M0-18V-15M18 0H15M0 18V15M-18 0H-15" stroke="#C3E7ED" strokeLinecap="round"/><path d="M0-12V0L9 5" stroke="#D8F8FC" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle r="2.5" fill="#E8C775"/></g>
      <path d="M51 42V49M47.5 45.5H54.5M209 67V74M205.5 70.5H212.5" stroke="#9ECFDA" strokeOpacity=".65" strokeLinecap="round"/>
    </>}
  </svg>;
}
