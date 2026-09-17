
(() => {
  'use strict';
  const $ = (id) => document.getElementById(id);
  const hubView = $('hub-view');
  const practice2View = $('practice2-view');
  const inputIds = ['price','income','taco','wine','sauce','wage','tax'];
  const initialModelValues = {price:'10,00',income:'20000',taco:'6,00',wine:'20,00',sauce:'3,00',wage:'5,00',tax:'0,00'};

  const questionDefs = [
    {q:"Amb tots els valors de referència, quin és el preu d'equilibri?", unit:'€/plat', type:'price', grade:{kind:'eqPrice',scenario:'base'}, answer:s=>s.base.p},
    {q:"Amb tots els valors de referència, quina és la quantitat d'equilibri?", unit:'plats/dia', type:'qty', grade:{kind:'eqQty',scenario:'base'}, answer:s=>s.base.q},
    {reset:true,q:"Si la renda augmenta fins a 27.000 €, quin és el nou preu d'equilibri?", unit:'€/plat', type:'price', grade:{kind:'eqPrice',scenario:'income27'}, answer:s=>s.income27.p},
    {q:"En aquest mateix cas, quina és la nova quantitat d'equilibri?", unit:'plats/dia', type:'qty', grade:{kind:'eqQty',scenario:'income27'}, answer:s=>s.income27.q},
    {q:"En aquest mateix cas, els espaguetis són un bé normal o inferior?", unit:'', type:'select', options:['Normal','Inferior'], answer:s=>s.normality},
    {reset:true,q:"Si el preu dels tacos baixa a 3 €, què passa amb l'oferta d'espaguetis?", unit:'', type:'select', options:['Augmenta','Disminueix','No canvia'], answer:()=> 'No canvia'},
    {q:"En aquest mateix cas, què passa amb la demanda d'espaguetis?", unit:'', type:'select', options:['Augmenta','Disminueix','No canvia'], answer:()=> 'Disminueix'},
    {q:"En aquest mateix cas, quin és el nou preu d'equilibri?", unit:'€/plat', type:'price', grade:{kind:'eqPrice',scenario:'tacos3'}, answer:s=>s.tacos3.p},
    {q:"En aquest mateix cas, quina és la nova quantitat d'equilibri?", unit:'plats/dia', type:'qty', grade:{kind:'eqQty',scenario:'tacos3'}, answer:s=>s.tacos3.q},
    {reset:true,q:"Si el salari puja a 7,50 €/h, què passa amb l'oferta?", unit:'', type:'select', options:['Augmenta','Disminueix','No canvia'], answer:()=> 'Disminueix'},
    {q:"En aquest mateix cas, què passa amb la demanda?", unit:'', type:'select', options:['Augmenta','Disminueix','No canvia'], answer:()=> 'No canvia'},
    {q:"En aquest mateix cas, quin és el nou preu d'equilibri?", unit:'€/plat', type:'price', grade:{kind:'eqPrice',scenario:'wage75'}, answer:s=>s.wage75.p},
    {q:"En aquest mateix cas, quina és la nova quantitat d'equilibri?", unit:'plats/dia', type:'qty', grade:{kind:'eqQty',scenario:'wage75'}, answer:s=>s.wage75.q},
    {reset:true,q:"Aplica un impost de 4 €/plat. Quin és el nou preu d'equilibri?", unit:'€/plat', type:'price', grade:{kind:'eqPrice',scenario:'tax4'}, answer:s=>s.tax4.p},
    {q:"En aquest mateix cas, quina és la nova quantitat d'equilibri?", unit:'plats/dia', type:'qty', grade:{kind:'eqQty',scenario:'tax4'}, answer:s=>s.tax4.q},
    {q:"En aquest mateix cas, quant ha augmentat el preu respecte de la situació inicial?", unit:'€/plat', type:'price', grade:{kind:'priceDelta',scenario:'tax4'}, answer:s=>roundAsDisplayed(s.tax4.p,2)-roundAsDisplayed(s.base.p,2)},
    {q:"En aquest mateix cas, quina és la recaptació total diària de l'impost?", unit:'€/dia', type:'money', grade:{kind:'qtyTimes',scenario:'tax4',rate:4}, answer:s=>4*roundAsDisplayed(s.tax4.q,0)},
    {reset:true,q:"Aplica una subvenció de 3 €/plat. Quina és la variació del preu (nou − inicial)?", unit:'€/plat', type:'price', grade:{kind:'priceDelta',scenario:'sub3'}, answer:s=>roundAsDisplayed(s.sub3.p,2)-roundAsDisplayed(s.base.p,2)},
    {q:"En aquest mateix cas, quina és la variació de la quantitat (nova − inicial)?", unit:'plats/dia', type:'qty', grade:{kind:'qtyDelta',scenario:'sub3'}, answer:s=>roundAsDisplayed(s.sub3.q,0)-roundAsDisplayed(s.base.q,0)},
    {q:"En aquest mateix cas, quin és el cost total diari de la subvenció per al govern?", unit:'€/dia', type:'money', grade:{kind:'qtyTimes',scenario:'sub3',rate:3}, answer:s=>3*roundAsDisplayed(s.sub3.q,0)}
  ];

  function renderQuestions(){
    const host = $('questions-body');
    host.innerHTML = '';
    questionDefs.forEach((d,i)=>{
      const row=document.createElement('div'); row.className='q-row';
      const num=document.createElement('div'); num.className='q-num'; num.textContent=String(i+1);
      const txt=document.createElement('div'); txt.className='q-text';
      if(d.reset){
        const lead=document.createElement('strong'); lead.textContent='Torna als valors inicials. ';
        txt.appendChild(lead); txt.appendChild(document.createTextNode(d.q));
      }else txt.textContent=d.q;
      const ans=document.createElement('div'); ans.className='q-answer';
      let control;
      if(d.type==='select'){
        control=document.createElement('select');
        const ph=document.createElement('option'); ph.value=''; ph.textContent='Selecciona…'; control.appendChild(ph);
        d.options.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;control.appendChild(op);});
      }else{
        control=document.createElement('input'); control.type='text'; control.inputMode='decimal'; control.autocomplete='off';
      }
      control.id=`answer-${i+1}`; control.setAttribute('aria-label',`Resposta pregunta ${i+1}`); ans.appendChild(control);
      const unit=document.createElement('div'); unit.className='q-unit'; unit.textContent=d.unit;
      const check=document.createElement('div'); check.className='q-check blank'; check.id=`check-${i+1}`; check.textContent='·';
      row.append(num,txt,ans,unit,check); host.appendChild(row);
      control.addEventListener('change',()=>checkAnswer(i));
      if(d.type!=='select') control.addEventListener('keydown',(e)=>{if(e.key==='Enter'){e.preventDefault();control.blur();checkAnswer(i);}});
      if(d.type!=='select') control.addEventListener('blur',()=>checkAnswer(i));
    });
  }

  function parseNumber(v){
    if(typeof v==='number') return Number.isFinite(v)?v:NaN;
    let s=String(v??'').trim().replace(/\s/g,'');
    if(s==='') return NaN;
    const comma=s.lastIndexOf(','), dot=s.lastIndexOf('.');
    if(comma>=0 && dot>=0){
      const decimalPos=Math.max(comma,dot);
      const intPart=s.slice(0,decimalPos).replace(/[.,]/g,'');
      const decPart=s.slice(decimalPos+1);
      s=intPart+'.'+decPart;
    }else if(comma>=0){
      const parts=s.split(',');
      if(parts.length===2) s=parts[0]+'.'+parts[1];
      else s=parts.join('');
    }else if(dot>=0){
      const parts=s.split('.');
      if(parts.length===2 && parts[1].length===3 && Math.abs(Number(parts[0]))>=10) s=parts.join('');
      else if(parts.length>2) s=parts.join('');
    }
    return Number(s);
  }
  function clampPositive(v,fallback){ return Number.isFinite(v)&&v>0?v:fallback; }
  function mod(a,m){ return ((a%m)+m)%m; }
  function seedFromId(id){
    const s=String(id??'').trim();
    const last=s.slice(-4);
    return /^\d+$/.test(last)?(Number(last)%10000):6380;
  }
  function parameters(seed){
    return {
      SA:0.45+0.06*mod(seed*37+11,997)/997,
      SB:-0.65+0.08*mod(seed*41+17,991)/991,
      SD:-0.75+0.10*mod(seed*43+23,983)/983,
      SF:75+mod(seed*47+29,977)/977,
      DA:0.17+0.06*mod(seed*53+31,971)/971,
      DB:0.66+0.08*mod(seed*59+37,967)/967,
      DD:-0.85+0.10*mod(seed*61+41,953)/953,
      DE:0.17+0.06*mod(seed*67+43,947)/947,
      DF:-0.13+0.03*mod(seed*71+47,941)/941
    };
  }
  function constants(p, m){
    const D=100*p.DA*Math.pow(m.income,p.DB)*Math.pow(m.taco,p.DE)*Math.pow(m.wine,p.DF);
    const S=100*p.SF*Math.pow(m.sauce,p.SB)*Math.pow(m.wage,p.SD);
    return {D,S};
  }
  function qDemand(price,p,D){ return D*Math.pow(Math.max(price,0.000001),p.DD); }
  function qSupply(price,p,S,tax){ return price<=tax ? 0 : S*Math.pow(price-tax,p.SA); }
  function equilibrium(p,m){
    const {D,S}=constants(p,m);
    const f=(x)=>qDemand(x,p,D)-qSupply(x,p,S,m.tax);
    let lo=Math.max(0.0001,m.tax+0.000001), hi=Math.max(10,lo+10);
    let guard=0;
    while(f(hi)>0 && guard++<80) hi*=1.7;
    if(!Number.isFinite(hi)||hi>1e7) return {p:NaN,q:NaN,D,S};
    for(let i=0;i<100;i++){
      const mid=(lo+hi)/2;
      if(f(mid)>0) lo=mid; else hi=mid;
    }
    const pe=(lo+hi)/2;
    return {p:pe,q:qDemand(pe,p,D),D,S};
  }
  function readModel(){
    const defaults={price:10,income:20000,taco:6,wine:20,sauce:3,wage:5,tax:0};
    const m={};
    inputIds.forEach(id=>{ const n=parseNumber($(id).value); m[id]=(id==='tax')?(Number.isFinite(n)?n:defaults[id]):clampPositive(n,defaults[id]); });
    return m;
  }
  function resetModelValues(){
    // Restaura les condicions base del model per a l'ID actual.
    // El preu es recalcula perquè el punt de partida torni a ser l'equilibri.
    ['income','taco','wine','sauce','wage','tax'].forEach(id=>{ $(id).value=initialModelValues[id]; });
    const p=parameters(seedFromId($('student-id').value));
    const base={income:20000,taco:6,wine:20,sauce:3,wage:5,tax:0};
    const eq=equilibrium(p,base);
    $('price').value=Number.isFinite(eq.p) ? eq.p.toFixed(2).replace('.',',') : initialModelValues.price;
    updateModel();
  }
  function scenarios(p){
    const base={income:20000,taco:6,wine:20,sauce:3,wage:5,tax:0};
    return {
      base:equilibrium(p,{...base}),
      income27:equilibrium(p,{...base,income:27000}),
      tacos3:equilibrium(p,{...base,taco:3}),
      wage75:equilibrium(p,{...base,wage:7.5}),
      tax4:equilibrium(p,{...base,tax:4}),
      sub3:equilibrium(p,{...base,tax:-3}),
      normality:p.DB>0?'Normal':'Inferior'
    };
  }
  const fmt0=new Intl.NumberFormat('ca-ES',{maximumFractionDigits:0});
  const fmt2=new Intl.NumberFormat('ca-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  function signed0(v){return (v>0?'+':'')+fmt0.format(v)}

  let currentParams=parameters(6380), currentScenarios=scenarios(currentParams);

  function updateModel(){
    const seed=seedFromId($('student-id').value);
    currentParams=parameters(seed);
    currentScenarios=scenarios(currentParams);
    const m=readModel();
    const eq=equilibrium(currentParams,m);
    const {D,S}=constants(currentParams,m);
    const qd=qDemand(m.price,currentParams,D), qs=qSupply(m.price,currentParams,S,m.tax), excess=qd-qs;
    const tolerance=Math.max(1,0.005*eq.q);
    const situation=Math.abs(excess)<=tolerance?'Equilibri':(excess>0?'Excés de demanda':"Excés d'oferta");
    $('qd').textContent=fmt0.format(qd);
    $('qs').textContent=fmt0.format(qs);
    $('excess').textContent=signed0(excess);
    $('situation').textContent=situation;
    $('peq').textContent=fmt2.format(eq.p);
    $('qeq').textContent=fmt0.format(eq.q);
    drawChart(m,currentParams,eq,{qd,qs,D,S});
    for(let i=0;i<questionDefs.length;i++){
      const c=$(`answer-${i+1}`); if(c && c.value!=='') checkAnswer(i);
    }
  }

  function roundAsDisplayed(value,decimals){
    if(!Number.isFinite(value)) return NaN;
    const formatted=new Intl.NumberFormat('en-US',{useGrouping:false,minimumFractionDigits:decimals,maximumFractionDigits:decimals}).format(value);
    return Number(formatted);
  }

  function equilibriumScenarioModel(key){
    const base={income:20000,taco:6,wine:20,sauce:3,wage:5,tax:0};
    if(key==='base') return {...base};
    if(key==='income27') return {...base,income:27000};
    if(key==='tacos3') return {...base,taco:3};
    if(key==='wage75') return {...base,wage:7.5};
    if(key==='tax4') return {...base,tax:4};
    if(key==='sub3') return {...base,tax:-3};
    return null;
  }

  function visibleEquilibriumCandidates(key){
    const m=equilibriumScenarioModel(key);
    if(!m) return {prices:[],quantities:[]};
    const eq=equilibrium(currentParams,m);
    const {D,S}=constants(currentParams,m);
    const tolerance=Math.max(1,0.005*eq.q);
    const center=roundAsDisplayed(eq.p,2);
    const prices=new Set();
    const quantities=new Set([roundAsDisplayed(eq.q,0)]);
    // Explorem els preus visibles (cèntims) al voltant de l'equilibri exacte.
    // Només conservem aquells que la mateixa interfície classifica com a "Equilibri".
    for(let k=-100;k<=100;k++){
      const price=roundAsDisplayed(center+k/100,2);
      if(!Number.isFinite(price) || price<=m.tax) continue;
      const qd=qDemand(price,currentParams,D);
      const qs=qSupply(price,currentParams,S,m.tax);
      if(Number.isFinite(qd)&&Number.isFinite(qs)&&Math.abs(qd-qs)<=tolerance){
        prices.add(price);
        quantities.add(roundAsDisplayed(qd,0));
        quantities.add(roundAsDisplayed(qs,0));
      }
    }
    return {prices:[...prices],quantities:[...quantities]};
  }

  function displayedExpected(def){
    const exact=def.answer(currentScenarios);
    if(def.type==='select') return exact;
    const decimals=def.type==='price'?2:0;
    return roundAsDisplayed(exact,decimals);
  }

  function acceptedNumericValues(def){
    const g=def.grade;
    if(!g) return [displayedExpected(def)];
    const base=visibleEquilibriumCandidates('base');
    const scenario=g.scenario?visibleEquilibriumCandidates(g.scenario):null;
    if(g.kind==='eqPrice') return scenario.prices;
    if(g.kind==='eqQty') return scenario.quantities;
    if(g.kind==='priceDelta'){
      const out=new Set();
      scenario.prices.forEach(n=>base.prices.forEach(b=>out.add(roundAsDisplayed(n-b,2))));
      return [...out];
    }
    if(g.kind==='qtyDelta'){
      const out=new Set();
      scenario.quantities.forEach(n=>base.quantities.forEach(b=>out.add(roundAsDisplayed(n-b,0))));
      return [...out];
    }
    if(g.kind==='qtyTimes') return [...new Set(scenario.quantities.map(q=>roundAsDisplayed(g.rate*q,0)))];
    return [displayedExpected(def)];
  }

  function checkAnswer(i){
    const def=questionDefs[i], control=$(`answer-${i+1}`), box=$(`check-${i+1}`);
    if(!control||!box) return;
    const raw=control.value;
    if(raw===''){box.className='q-check blank';box.textContent='·';return;}
    let ok=false;
    if(def.type==='select') ok=raw===displayedExpected(def);
    else{
      const given=parseNumber(raw);
      if(Number.isFinite(given)){
        const decimals=def.type==='price'?2:0;
        const visibleGiven=roundAsDisplayed(given,decimals);
        // Totes les respostes numèriques es comparen exclusivament amb valors que
        // l'alumne pot veure a pantalla. Si diversos valors visibles són compatibles
        // amb la tolerància d'"Equilibri", tots es consideren correctes.
        const accepted=acceptedNumericValues(def);
        ok=accepted.some(v=>v===visibleGiven);
      }
    }
    box.className='q-check '+(ok?'correct':'wrong');
    box.textContent=ok?'Correcte':'Revisa-ho';
  }

  function svgEl(name,attrs={}){
    const el=document.createElementNS('http://www.w3.org/2000/svg',name);
    Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));
    return el;
  }
  function drawChart(m,p,eq,stats){
    const svg=$('market-chart');
    while(svg.firstChild) svg.removeChild(svg.firstChild);
    const box=svg.getBoundingClientRect();
    const W=Math.max(520,Math.round(box.width||650)), H=Math.max(500,Math.round(box.height||650));
    svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const margin={l:58,r:18,t:16,b:52};
    const pw=W-margin.l-margin.r, ph=H-margin.t-margin.b;
    const qMaxRaw=Math.max(7000,eq.q*2.05,stats.qd*1.45,stats.qs*1.45);
    const qMax=Math.min(25000,Math.ceil(qMaxRaw/500)*500);
    const qProbe=Math.max(qMax*0.075,300);
    const demandAtProbe=Math.pow(qProbe/stats.D,1/p.DD);
    const yRaw=Math.max(80,eq.p*2.3,m.price*1.35,Math.min(120,demandAtProbe));
    const yMax=Math.min(200,Math.ceil(yRaw/10)*10);
    const x=(q)=>margin.l+(q/qMax)*pw;
    const y=(price)=>margin.t+ph-(Math.max(0,Math.min(yMax,price))/yMax)*ph;

    const gGrid=svgEl('g');
    const yTicks=8, xTicks=6;
    for(let i=0;i<=yTicks;i++){
      const val=yMax*i/yTicks, yy=y(val);
      gGrid.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#d6d4cf','stroke-width':1,'stroke-dasharray':'2 3'}));
      const t=svgEl('text',{x:margin.l-8,y:yy+3.5,'text-anchor':'end','font-size':10,fill:'#555b5e'});t.textContent=fmt0.format(val);gGrid.appendChild(t);
    }
    for(let i=0;i<=xTicks;i++){
      const val=qMax*i/xTicks, xx=x(val);
      const t=svgEl('text',{x:xx,y:H-margin.b+18,'text-anchor':'middle','font-size':10,fill:'#555b5e'});t.textContent=fmt0.format(val);gGrid.appendChild(t);
    }
    svg.appendChild(gGrid);
    svg.appendChild(svgEl('line',{x1:margin.l,y1:margin.t,x2:margin.l,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));
    svg.appendChild(svgEl('line',{x1:margin.l,y1:H-margin.b,x2:W-margin.r,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));

    const samples=140;
    let dPath='',sPath='';
    for(let i=1;i<=samples;i++){
      const q=qMax*i/samples;
      const pd=Math.pow(q/stats.D,1/p.DD);
      const ps=m.tax+Math.pow(q/stats.S,1/p.SA);
      if(Number.isFinite(pd) && pd>=0 && pd<=yMax*1.25) dPath+=(dPath?' L ':'M ')+x(q)+' '+y(pd);
      if(Number.isFinite(ps) && ps>=0 && ps<=yMax*1.25) sPath+=(sPath?' L ':'M ')+x(q)+' '+y(ps);
    }
    svg.appendChild(svgEl('path',{d:dPath,fill:'none',stroke:'#1f6d95','stroke-width':3,'stroke-linecap':'round'}));
    svg.appendChild(svgEl('path',{d:sPath,fill:'none',stroke:'#e8682b','stroke-width':3,'stroke-linecap':'round'}));

    if(m.price>=0 && m.price<=yMax){
      const yy=y(m.price);
      svg.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#7a746d','stroke-width':1.6,'stroke-dasharray':'7 5'}));
      const pt=svgEl('text',{x:W-margin.r-2,y:yy-6,'text-anchor':'end','font-size':10,fill:'#69635d','font-weight':700});pt.textContent=`P actual ${fmt2.format(m.price)}`;svg.appendChild(pt);
      [{q:stats.qd,label:'Qd',fill:'#1f6d95'},{q:stats.qs,label:'Qs',fill:'#e8682b'}].forEach(o=>{
        if(Number.isFinite(o.q) && o.q<=qMax){
          const xx=x(o.q); svg.appendChild(svgEl('circle',{cx:xx,cy:yy,r:4.2,fill:o.fill,stroke:'#fff','stroke-width':1.5}));
          const tt=svgEl('text',{x:xx,y:yy-9,'text-anchor':'middle','font-size':10,fill:o.fill,'font-weight':800});tt.textContent=o.label;svg.appendChild(tt);
        }
      });
    }
    if(Number.isFinite(eq.p)&&Number.isFinite(eq.q)&&eq.p<=yMax&&eq.q<=qMax){
      const ex=x(eq.q),ey=y(eq.p);svg.appendChild(svgEl('circle',{cx:ex,cy:ey,r:4.1,fill:'#44484c',stroke:'#fff','stroke-width':1.4}));
    }

    const xt=svgEl('text',{x:margin.l+pw/2,y:H-8,'text-anchor':'middle','font-size':11.5,fill:'#353a3d','font-weight':700});xt.textContent='Quantitat (plats/dia)';svg.appendChild(xt);
    const yt=svgEl('text',{x:15,y:margin.t+ph/2,'text-anchor':'middle','font-size':11.5,fill:'#353a3d','font-weight':700,transform:`rotate(-90 15 ${margin.t+ph/2})`});yt.textContent='Preu (€/plat)';svg.appendChild(yt);
  }


  const practice2PdfBase64 = "JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiswIDEwIDAgUiAvRjMrMCAxNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQ29udGVudHMgMTggMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5OCBdIC9QYXJlbnQgMTcgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0NvbnRlbnRzIDE5IDAgUiAvTWVkaWFCb3ggWyAwIDAgNTk1LjI3NTYgODQxLjg4OTggXSAvUGFyZW50IDE3IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAyMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCAxNyAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovQ29udGVudHMgMjEgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5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dCA3MTQgL0Rlc2NlbnQgLTI5MyAvRmxhZ3MgNCAvRm9udEJCb3ggWyAtNjIxIC0zODkgMjgwMCAxMDY3IF0gL0ZvbnRGaWxlMiA4IDAgUiAKICAvRm9udE5hbWUgL0FBQUFBQStOb3RvU2Fucy1SZWd1bGFyIC9JdGFsaWNBbmdsZSAwIC9NaXNzaW5nV2lkdGggNjAwIC9TdGVtViA4NyAvVHlwZSAvRm9udERlc2NyaXB0b3IKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9CYXNlRm9udCAvQUFBQUFBK05vdG9TYW5zLVJlZ3VsYXIgL0ZpcnN0Q2hhciAwIC9Gb250RGVzY3JpcHRvciA5IDAgUiAvTGFzdENoYXIgMTI3IC9OYW1lIC9GMiswIC9TdWJ0eXBlIC9UcnVlVHlwZSAKICAvVG9Vbmljb2RlIDcgMCBSIC9UeXBlIC9Gb250IC9XaWR0aHMgWyAwIDYwNSAyNjggNTYxIDE3NSA2MTggNTY0IDU2NCA0ODAgNjA1IAogIDI1OCAyNTggNTcyIDEwMDAgMCAwIDAgMCAwIDAgCiAgMCAwIDAgMCAwIDAgMCAwIDAgMCAKICAwIDAgMjYwIDI2OSA0MDggNjQ2IDU3MiA4MzEgNzMyIDIyNSAKICAzMDAgMzAwIDU1MSA1NzIgMjY4IDMyMiAyNjggMzcyIDU3MiA1NzIgCiAgNTcyIDU3MiA1NzIgNTcyIDU3MiA1NzIgNTcyIDU3MiAyNjggMjY4IAogIDU3MiA1NzIgNTcyIDQzNCA4OTkgNjM5IDY1MCA2MzIgNzMwIDU1NiAKICA1MTkgNzI4IDc0MSAzMzkgMjczIDYxOSA1MjQgOTA3IDc2MCA3ODEgCiAgNjA1IDc4MSA2MjIgNTQ5IDU1NiA3MzEgNjAwIDkzMCA1ODYgNTY2IAogIDU3MiAzMjkgMzcyIDMyOSA1NzIgNDQ0IDI4MSA1NjEgNjE1IDQ4MCAKICA2MTUgNTY0IDM0NCA2MTUgNjE4IDI1OCAyNTggNTM0IDI1OCA5MzUgCiAgNjE4IDYwNSA2MTUgNjE1IDQxMyA0NzkgMzYxIDYxOCA1MDggNzg2IAogIDUyOSA1MTAgNDcwIDM4MCA1NTEgMzgwIDU3MiA2MDAgXQo+PgplbmRvYmoKMTEgMCBvYmoKPDwKL0Zp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OSA3MjQgNzY1IDM4OSAzMzEgNjY0IDU2NSA5NDMgODEzIDc5NiAKICA2MjggNzk2IDY2MCA1NTEgNTc5IDc1NiA2NTAgOTY3IDY2NyA2MjQgCiAgNTc5IDMzMSA0MTMgMzMxIDU3MiA0MTEgMzYyIDYwNCA2MzMgNTE0IAogIDYzMyA1OTEgMzg3IDYzMyA2NTcgMzA1IDMwNSA2MjAgMzA1IDk4MiAKICA2NTcgNjE5IDYzMyA2MzMgNDU0IDQ5NyA0MzQgNjU3IDU2OSA4NTYgCiAgNTc4IDU2OSA0ODggMzk0IDU1MSAzOTQgNTcyIDYwMCBdCj4+CmVuZG9iagoxNSAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDE3IDAgUiAvVHlwZSAvQ2F0YWxvZwo+PgplbmRvYmoKMTYgMCBvYmoKPDwKL0F1dGhvciAoSW50cm9kdWNjaVwzNjMgYSBsJ2Vjb25vbWlhKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwOTE2MDgyNDU4KzAwJzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwOTE2MDgyNDU4KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChQclwzNDBjdGljYSAyIFwyNjcgRXF1aWxpYnJpIGRlIG1lcmNhdCkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iagoxNyAwIG9iago8PAovQ291bnQgNCAvS2lkcyBbIDMgMCBSIDQgMCBSIDUgMCBSIDYgMCBSIF0gL1R5cGUgL1BhZ2VzCj4+CmVuZG9iagoxOCAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAyMjUxCj4+CnN0cmVhbQpHYXUwRD5CZU9jJjpYQVdRbz5FX1dwVVssSDRKPC8tVSEjO0AsPy0yOTpOLkdcZW4hczNXOFhMQWxrL0lgYm5KJEUvNV1gWm5xPHVtMkxFNWloKix1azd1Q2Yib1xAUzgiTk03KXRIPENVcj1YTjA0cGhnOilZSHNQYF8uNj9CPjwiZGJAISE6LjFeZTIrPStzcUVhSUgmMz9zMSxuWCxrS3FbTnNldFxEYmMoJEpEciUnKkBONUVnM0VRK1ZjOSd1IVNXa0g2O2tyQFM8JlFvR2suYk5rX2pBSCY9MEotZUhqcWkwdDJUN2AnZUhhXyE4NVQrUWsiWFoyOGVAVGhvUVEzZE9TOjRAaj9LTlwqQSprZTQxOzo3RjBeUiRILkxhJUo3RW1nRk0nSFQ7Ryorck0xUixZTi9aPVpJXytUJVl1KT8nQEVOTmtHMGAvQkIoPlRbcFwxanQ/ImlELWQsaCVvPScnPUM/PTFAdFovcjJJIThrKiVPN0FFcWovNz47K2EvPSNcaj8lRDI6OXRqNUBARmY8MUJVam9FUTNOZm1xQDRYXTs/ZFhlSi1bLS8yXHMtV29KI05yLj9EaVUoSlk0RWdjU2pRT0NmV3VLYWNpWEJFdVUrWXFqKiVhN0k+Z3NfQ09mWU9IKj9kM0dRKWdlTStDI0NHVDk2LVM6Ik08RS5JLEwtTk5CT0RGND9bNSpQQDU9KzJvcFpQNkxrTzopOmZfYmgiT2gxW1JvXWNtJC5PYllmaDVQKmhqK2dLKWJJUEY4SnQyLDxKa0YxJE1zPC1iN3VOIlZuIzJoUTUnPC1aNG5YNWojKyc6Nyk7VFpRXkBAaDdgNSE1XGVZXihIdUUvYWpyL11AUXRlX2JYUlljMHRoP2NTUmtpSFdfL2gxaUZrLE4qSiRqOSVCanRqP1kzJ0J1JTRESEBRYDxuZEBKWUpqLTsqOWNNSjA2aXRINT4uSSttOSdganFrOFBuaSdaVWY4PS5AJUNcSHJxZjxkKiJQcjBEciZYY0FzJFtfaEtIPVglMmBgVVBWWl5SSTVpQFpWTVcwTScqcyRbI05ERkI5RVU8Yy1sb24lIk0wKUxxJmRHTlo1SDkzTyorTmsuRFQvTVRaMS9DJDY9TEJUWzJLPj9fPypdUjJnLDdTYVlvNCI3ITAxQDdmUVE0LWBpJnQ+bTsyUTlaOVxAblUpRlt1anBub0JMYGFzVFRNOWQhPz5gLGckWGZQJm05QThPWjglISlYZkdMQSxSQ25hPjkmLVJcWTwkT2tnZC9RcjczU2EzNmhQWmg4ZWsoRC5GYj9yKDxNQFA/KyRFR2ZvclcyLjQ1TGVcQHExJG8+PnRRcFEyLSlDcCIvQG5BQWFIND8iLjciKGBpMyo/LnBBOmRHPklTZVRwL1JcP2NmR044Sy8/L2pAKlU4KElGSWFAOj9ZLGUhbCxzVThoS04+Q1Q2Ni5WMXJFcmU4W2hoXmtFSXIqOGpzP08hbjszb3ArcilmQCM6TzZpVEBXUmtwaFpESSRCPyVERzQ3QEUiMVU8S2t0RlQmR2Zmajw0PWQzQj08MDpFbkVeOTshcm1iOD0vcGdEOmAqVVhFclJXL0BXUylrPSh0QFJbPmc9OkJTMTBvKiNWMUBhMDlWRGhFQyk0WzI+VCVXWTQyPFtkKD1OKTopLTFvRldoNUppbCpgTi5nSGFacidCbkldUFxtVV9SJzE/dUU/T1YuciwjUmc5OyFBQzJpRD5ST0hjYlBGblIlOGs7TCUrN1RbOkZITCFzL2pqclUzNE5vcjlKaExiYURwVGJiV2tJM0Q2KDZxNFI+Ilo9PCNcWktqQ0ppSk8rOlQ6VHVKI2RzJCM2QT88MWlZLEVeKGFiV1o7alFnVSM6SyxWLipiOXQmYixHTFozWW1VPyEpYXJJZ18jazdLdF9oXnVbVDo2NypKYyJYKEI8JipRaE5pRCcoQSEwO25tTidnb0NFLTJoUW49OVRfJltKOjpeLT89Xj5FWGFIcGBzZyNKOzRcbTFCNytMJXQzU0RyYD08Ml5gKS1AOkMuNGhyNDpSWzhpISR1QlFUVUpnaUowcDw2MFVzW25HQztnXTwkUTVtUiUzNnIvKTgpZmVKUjkjdDsyNltlXFcqVWwxLEtbbj8uTVdZPmlLa0YnXzJcIj1OQWQ8dE9nayhuUGdeXTorN0UnZ0RURTI+JFtRT1lGNUY/WSxDNCJtRDpndS5bMVhUPDVAPG9YKFhWPD9JUS1aPlYtZik7TXIpdHM4XkJbIT1BOEwvV0pcUl1kUnQtcFkldUNhYyhbLyYuY2hxS1xUWywwNFkwQ1FGTzdDSEwlJWRNKiU0VTFUKiNUOVhFI0smTD5jZk9cWT8nUjBAb3E1QyJfO3RCbGhxNFREOklZRHI2amxZSE8+aSYiMXIzLEA6OU8qOzBHPT1hLklyIjZqOywrMks1SVpBZkpaZEA4ayRfMC9VOnBBQTEjWFwhKDlURClNKzZGYWU9TEQxMSVQNU9rN1NDV2ohNDMxTmk5Q08oR0lNW2JPOS9KazBpXDJkRzREdEtYQ18mLTpEQEhhUUUoOTdZaWA4PDU0RnJBIiFDIy9rdGpTYk9oaiMvYFdxKFQucSphRFM0YUA8ZEQ+Sm4iNS5vclJHRyUoKnM8ZjNGKztHOGszXS9AZ15OTUc6JiJsIi8hNzY6XUtKL1wqWGMjZywtIz0jW1whKnI1TyZwcCxhNG1ccHQjJiZHY25sKl5PZ21ubUE/Q1Q2WltEXHN1U2g3QVxmQ1E5I2hSNj5GbkcjVCxUOSsvRGtoOFVQPitlQldJdFlkVkkiajlfLUFyRUtbRiReYU8oTnVGWj4qUm5zJ28oW2ROK0QnI2xyKE9hYnJsa0M5dFQsNCJUZl1aYkEmcl5SUWA0Xjc2Ji0iP1JmM2xdYCRxb2dPbm9MQi1rMzhYcmZXQ09tNDlDbCxuRWpTMmFNOVM0cWsxMV9QK1JmKlVdL3UxM34+ZW5kc3RyZWFtCmVuZG9iagoxOSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAyMDIyCj4+CnN0cmVhbQpHYXVITGFgPy0qJkFAWmNxQS4lSWBqOSkoVCxjVFcuSE9OM1tbYE83Nlhaay4iVWxlMU1DVyYrbUshVEYxMjAnMCdXT1A0WlpaJC5JMD1OZSdFMSdGIUloUzFrSiU/OCZvS1RNMXQtRjgoPmRpSm1UKG1pJkojTF5ZbkFOYXBrOENWWF1QUlFZOGRbc0VOKTgyOGkmKU8uIkRwM1hkS1NFNk5xaj4wcyhNRkJPRW1KJCgoRyo2ZlQkS2dELGtlIiNvN1s7VyYtWU4qTVVnUWkpXC1LRzlRVktfVy1nRWMjKW4/KDBvSjMjPnRxcHFgaG1YMzAydE5fIkNyaiRUWVtTZjNcVF9UY2AnR3QtZGVCclFiM2s9SkJsP1IkUU5HME5EcC1TXCNfQTpZKEVfRlNAXiYzZ2FcKSt0XGU9dShyRjhmbCdxK21AI3MsVVg9KFBIY00wV1thXkVtRmk4LldQT2c3LXI/KUpUSUJQW0NZQWwuTnE5IlxqKlE1ZWlRX0lKbWY8dWlvXkQvaW42Q0JYby0vLFEwamtBO1dzbGFhZkBsXCdsPG5DQ2ZbZVM5bm5YYEUzYEc0ZCx1ajNNZWhnRlsjMUJNWGohMD81MlZaQWNbSXFHbGc+NyF0OnI/biQtIj02c1NRTnBXKFEoZkRRM2lEUmleNChjTCVsbm4iQTFkSVFkRzxKXEdTWkkpIW9CLD9WJiZiRyZbKm0xJ0NwUVUrO2M8O2E+Kj8vSUJqYD9zUGpMQyFLbFYsWVVpODBBIjMkT0JIK29bLWVTRGdzZFM6LXE9QzZWUG42X2g7cj9nJDwuP0EsNihyIlE6K3FTUyRsJ2RNamhLPlwpKGdXSC5uMF9EL0EjSFNCPllePlw3VGgpaG5aX2E1biRKO3I4aChAZGxtUWpXIWMoRkVEUFxgWiNORD1EbF5ebGBSUUJDUjNrIzNHTCcjNDhVY0FoWCdVO1tdKF8oWHRYN3BlZlVZODgwRUY3PlxCQ0JOQDlxMEMmOTREQmsyQjdwVmQtTiIxNzRLNkBuTXFscC49XjlqNDsyJmQkb0opZyFMTEVnM3J1allGTTtBbTpxKElFNXNnRzNYUWo2OCNcI1tSMlFyWSc1J1RebWMmTCNfUV9uZk5TbVgqLSJEZmIzWm1wJGokWGJTVDMjZV1tPDJGUDYlPiZUcmknImQ8ImFYQ1hecC9nLyxZNWdVJkEiPzlgTkIwQSIxXTxyPVwqU2YnLFFhVXQ5a2xPPFo6QjxiIkJhT2JQRU5ITDYiOEBaWjkwbmQ8VD4hPFYrNTFaQ0FXYmBIPjVuWnI+Uz08biNTInBsRXFpaUVvJilzNFZiQEo1OElaYi1cJXI+cF5WZWo5UGEkQydTNS5xTDw7QSdlK1tgJ0VSIjlXaCEzcktxdSFHPHMiU3VpaFY9c1wuJEIsXTVyJyNwVyhgZE05T2ppKGMuSisnamVjVlE5bDAzLE5LODwvREhOb0xcMU44cT86alpiV0lKKzZvZ0BQR0E2PzcvI09UalMwO0sjSzBnRlBmZGc7Rlg/IVc+RElaN0hraUtWJmJObixSNFVgJUwwZUo+a28+KGBeQktMPShDW0MtciREWVIrb29wR3IjUEYqQS9hJUhEWi8qL1M7aSVXRFwkVkJybjtgQyJmYUJpYTFjbT0nQWY6RExjMGolWUZvcW5RLGYsSWtaVTdlVHJYO0w8OWsoSjInJ0RfNV47aFZddVc4Y0ZgNEpnM1thcCFUUGtuYllYYmgsT00+VzJGQ3NeO11RVS1XXjgiPj8jZDtWJDZiN3VfSUxxb1d1OTNHLGxdc2lNaiFFMVZPWkMkPUF0MzYkKTUzcDxCMlVAV0ZJc3QrInEjK2lWOC9NVG1FU2ZVNiVOaE1WcFpfWUZbLkcxbSQkXmQpJjBdPCtIQCZCPjc/b0onZ2siWV0rVGEmRkJcJjVCQy1nNi0sQTsxWnFjRTBbV3MoTFE4Q1ZoNnVvYENISygkR3FqIS9EXTZwYSY+ZERdXDpAVURRaWAySm89QGM3QGhcPixTSCUyZEQoSkIzQ1NOVDkuW101I1xBcTYnX2M5ODtNU0k8dV4wUGRJbz5vcTowWEt0SFssPzhgQHVlQWMsbGpJK0sjJDw+bGFvUVRcMkFCXTxFbFBeWixPVURmUmlQZ19KWGQ/aDldQEomYElzM3MqWCldPFY6UjhJRzdgaGdFMWE8XTJSbShSOCErJkA2UmdSPWBXTXBeODc4bnFMTldpS2tUR29CZzQ6SE1aQTx0OkFdVXVGRTRUQ2ckYWpbK104OVJSZ11FXU9QQFA9LTVBYythMXFBNCFZXi9FNzFzY2tmYUI9LGtVaFBPYS1ZV1tvcjNDRS0wUSg4a1xIS1pTWnBQKm5SMklQQEE7dDxYX2BPJC8zVUNaTkpFZlgrQTpJNVsvVGBcJTtjMG9PZGQlJjFPaiVzXXRMIllQQ2FlSGtQKjApPU5COEExTW8iJj5BcVFjTjRbRiMsLkY1Z1AtOCVELichak9bdF5hW1x1KjQ3QmxuL1wpIWsic1c/OlddL3RIb1hIa0c7KjhLI2xbTlwzYSE9I0g+K3FiVTZMOnIxR1guYm1EUUsibSRxckNzMykhQlIkJ2dAJUdaQSRaT1xXa1g2MWtES1Elbzg1T2I2OTNCaC03Yi5oaG1mPTwzRVo0ZmU2M05pfj5lbmRzdHJlYW0KZW5kb2JqCjIwIDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUgXSAvTGVuZ3RoIDE0MDEKPj4Kc3RyZWFtCkdhdUhMZ04pJSwmOk4vM2xxQUxrVkBlYjsjcztlSVJDKEY8VmohJjhRNT5wXz8kW25xanNBOjhHNig9Sy4kY0kpVTkoVUovMXU5ZyVNaS91IVE+UVdob1EpXGYraFFqYGRpJjJoI2BkLl9XaWUhXktOYE5MbUJicSMpRiRnX3VjUyNsMVk/WW5ERCo2QFlBYjZFPWU6MFZJQl1KOmY3cS8jLFdBKDA4TD0iKVtTbl5CZGgiTCVdVkNORzcvTjtHJWVKRzM1Wm51N01IZltgSUZRbVVJVHVMNEtfYjhcQE82QjlwMCRvLXRRZDBeSWpeLCdxPERLPXVebVhuS0YmVjkuXVMpQDxFKl1mNyNiSj9jIUJHXUlQYCNyPVM7WFxrQm9JMkIoUzInLiZsMilFaDplX1M2b25mM0JfN01dNUJFM0xEL3RlW2NGWE5YUDw4bGVxMXVSR0tnKDorSk8+IUdvbUEjZixJM1VgZCUiRSJeXDhZXWk8RTdfUmtLSDUxc1g4dWxnZlE4cC1USDRjK0NnRG9Iby40PVYvIUsjJkVYY2JHVGFxVDZAZGVCXydwc2FrQ0JbV284RmNlTU1lQ0VYVUJoMDknLDN1LCInaCtuLEtcOlNnM1ZUayFmU3JObTMoVGckMks4am0oMVJxYmdxSSkrJ042XlAmWF5XN1JuLSUzbVdwKStJNlYpbUZhSSNzJjAqTVxgNE9DS2NRR09gZmVpOT1PRjZGJzMmN1lUXyM3JiFcSXBXO2BScFVXbTF1NlVsO2dNTzMwaiQlclZraV9nPT9MOEMkOks4Tjsqa0pGJklZdCZqZVkhOWRpb14+PzomcWAwalpIRypAOWxwJkxFPVtgP0szSjcwR1wldG1Ob0UmZU5tOFJdWkRabi4wTF5ZQE8vPy45XUhHbS5QbD9CYzIrO2Q+TnFXU2JUO1FYb2UhND5gSnQ0JHI7Z183ISNWPUM3bjxjKk5scEhbQz9gbSR0cUBUaEpkMm9DJyUqOSNic0hVNyE6ZTteRUI3XFkqSlZWY2RvQkJPMSJscWFCQ15DSUhVcy1fND5AXG1CJGlLLHBlSCxiRlN1ODEsYFdmN1NAbWoqb3BdWjlCYnNXW0xeYWdadDM6JHJ0SiQhaFY4JT0uLVdXMkpET1ZmaycsI0Y4ZDA/TG1fMDFiUHM3Qz8uJlJAPlRzOFxpam8kWWFIVichRVRMX040IiliQmI0ZjJhWipBRz9JRGJdUXFDVytcbmIhJ1ouIWA6WT5WJFNXK2BqV1otRUIhKDFRdS1vOT5ySTFoREsjPDxEYEwlZG08JFBgYlVELFBvSXEuJF1KMEJDcFRpdTc1ZFE5Y1BwP1kkLG9ScD5HYCQtJ3MsR3JXTkVNTTo6dVtyOW85OXFEIlw8IkpFWl0kSW43SC08WV8obi9CdEAqJ0dHW24lKiktPic4Lzc1al0lNVlDcm9ANTxSaCw5ZmxrVi1NLDleYUEsVmZUOzVAPGMyMTlhPi06TVE/PmtEIWAjJD5KImdnNk0lLiFHK2BLWzZLV1JKXE9ZIUpTZ2FJVzBgKmxwTF9abU5JRk9yOTlSOW1UT0JkREw9UjpwL2lxbFBaOVdOQUhwb09oQi0ucSlxRipNZkRlJFNNT2JCI1FjTVxyYDtmXkVcJHIqRl4+N1xBRD5HM1ZmJjNgSj8jVyQsVSpESDcyJyJNNzNnZFp0KWNnRlFYLmtBJ2tjY0dgP0V1az5DWnFkYF85YSQiIz1EUUUrdThgRSlTMFpBKmgpYSgpYEMvI2I1OT1QTyJsQFpeKE1lVzY1N1IqJmBlSiElWlhyYUNBMFJRSXVlaW9HRUIlYCFtZ2ExaHI4L0BedUJqLDUkVCR+PmVuZHN0cmVhbQplbmRvYmoKMjEgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTUxNwo+PgpzdHJlYW0KR2IhO2VhX3AvdCZBQGc+J1RkcjFQOzE8XlUvIXVlOVMqQ2coYWtsRDA9NHBDZDZPR1s+K0J0aE1VXig7QShgRyExKFlDSlJvTF9MSCRtVE0kbi1RXHMjXEwsSWJNXjQwKzhcUXI+L2spOEQmRURPOEliTk5iQjsuJ2BsXjZNLDwrWHI6MCo1Li84LiU1cXReOiNXTildLXJaZ2sqMGNcQFgtImZfNUJmTCZgP1BbVy5OKSpEVC9gaCQ6dTpaZjIhX2RsVlcvKV9MYnNGP1VMM3FHJDZgU0BmLTlEMGpfcVJbTWFKL3VrcS9fPyR0TC9HPmhDNXIlQThCbGs3VSFJPmM0aC1yWFNZWkAvbyk7MVVcU1InInIwVE5eaG82M2VsVVYwV2NRL0BESV40OG4mXUVbV209MCtWOmZlOm1gZ1VCZSNpKUVEZlc4M0okPiZFN1ZQbWshIy1SSTpNVD1FY0RAbW0jJzhLI0xFOGkiZWQ6Y2NIOCFKKi44MF87MjteJj8/bz1xL283KjRgXiFmVkc6KExsWGVANjRhb21rOUVgNEBNNUVIWmRDbnNsRFYpO1lkJDZEb0JQU0t1UE5EbkdYQlQuWUsiVVliKDZeJ2lLaTdOY3RhUW1pZjpxQycyXD9xdFlgLmNpdWs3WXRLJGQ3TmBZIU5iT04mOHBaKHItam8kMGkvdW5wWCg/P0dVVDZgclpuZSJaa1QjME4sTDc6RiJWOzJ0VE8kNF86UWYpXW9ANzdoT1t0Smg0aS5OJXJfX0pUS2lZb29PUFtSa1lMYWBZX3E5QF5kPyVYQzNQOGlEYlE0PlEyZ0NbQWZlTlYxJ3VAMVdfRTg9SGFOKmNhZXEhRUgrUlFQYHRHRSo/MWFoYypkVVkxPWdlazI9M01lXnJSSjcwYGFQLEEuNycpQDRqJ0hjQyRSIjt0RChfUiJtI2ZsQ010IldCTUgmWVZsVycxZl03KmJPNkZNJVM6UilfPko2VjpqY1FBRFIlOi8+IipOXWgkUCs4KG44QC5jJmJOIS8pNFJwTVBNZ0I9NnBoYj5VNjhpZF5xN3QjOVpYRE9LQWtPXUtUcy0rayU4Uyg6bjdrJlBjZGE6MUozIzcqOVVKK2FuMXNCYCkxOl07aTFLMF4jVEYmTVN1P0ZhWmdEWCJGSU4sWyNCUTMkMGliKHBLMl9jXkYtNFNkIl5naTpfNUkkM0VGNTFPJC0/Lz5XKkg1XExaNzgvTisnSlhcTlFhSFYhZClAQUIhSXMiYEBAVDVrU3IjXVQjcGVXailOLnQ7TUdQMjpYIiNmXl4xVmhkL2klK0IoXF4oclQ6ZFRiWkVnOTQ9OV1BKlFBNC51TFp1L1FdNjBqbmIlWXVyRnFmTUJZbGgiZVIkXlcnOWhqLzFsJnQ8Q2VVSnImO2FsKShxVS5nUWVuWS5WPkItPSspb2hSLm1QPj9tOmlNTXQkVkomYzxNKys6PF1dZldWNERYQCsnQUdnL09HVG40aSFBZEFLPURDczQ1U2gjXSlEMCEmLEVOO0VyNTg1ZC9CTzREOyEmalgxLUw5cW8lWDlwJygpWWpLcW9KJjk3ME9KZ0tXI11kZT9rQ21cdERDVz5WMGx0aythYD9qUGQkQjxrLVtCSGhAQVxWJCRxMFBlLSxXc2l1TyVGJzNpU1VYT051KVIhbitjS2ttT19QSk8yOmM2Pl5ndWxDQmEsLGZRbj8nLlFTMGo4XzZoO2Z1X3JMXSE5cnMidVVibSQ2LCU8T1tTQSZsO2ZVOzZVIkBWRiY5dTc5VS9wPFctTCg+V3RjJVguXS4qa0ptUFNEZTE5R0VQdTo+M3FYdElSVDhyUjI8ZitrQV5ZVzZPcW5GTjNRRnBLdDUyMU1HZURrMDdHckQ8ZEErIUxsSGo8PVNtNWg+VTdaaENmO1k/KmxwbTVpPHBEZDUyTmRpLlRycVYkUTMiQC5xcjVSRilPbDtaZVhdaEgtQj82M3NWMUIkWWRlRjlaQWA7Km5DIldAbDNkZUdDfj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAyMgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDExOCAwMDAwMCBuIAowMDAwMDAwMjI1IDAwMDAwIG4gCjAwMDAwMDA0MzAgMDAwMDAgbiAKMDAwMDAwMDYzNSAwMDAwMCBuIAowMDAwMDAwODQwIDAwMDAwIG4gCjAwMDAwMDEwNDUgMDAwMDAgbiAKMDAwMDAwMTgzMyAwMDAwMCBuIAowMDAwMDE0MzY3IDAwMDAwIG4gCjAwMDAwMTQ1OTMgMDAwMDAgbiAKMDAwMDAxNTI4NSAwMDAwMCBuIAowMDAwMDE2MDU4IDAwMDAwIG4gCjAwMDAwMjgxNDggMDAwMDAgbiAKMDAwMDAyODM3OSAwMDAwMCBuIAowMDAwMDI5MDU3IDAwMDAwIG4gCjAwMDAwMjkxMjcgMDAwMDAgbiAKMDAwMDAyOTQ0NyAwMDAwMCBuIAowMDAwMDI5NTI1IDAwMDAwIG4gCjAwMDAwMzE4NjggMDAwMDAgbiAKMDAwMDAzMzk4MiAwMDAwMCBuIAowMDAwMDM1NDc1IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPGUzOGM0YTA2OWIxMzEwNWQ3ZDZkYjBhNGM5OGIyNjNiPjxlMzhjNGEwNjliMTMxMDVkN2Q2ZGIwYTRjOThiMjYzYj5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gMTYgMCBSCi9Sb290IDE1IDAgUgovU2l6ZSAyMgo+PgpzdGFydHhyZWYKMzcwODQKJSVFT0YK";
  function openPracticePdf(){
    try{
      const raw=atob(practice2PdfBase64);
      const bytes=new Uint8Array(raw.length);
      for(let i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
      const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));
      const win=window.open(url,'_blank','noopener');
      if(!win){
        const a=document.createElement('a');
        a.href=url; a.target='_blank'; a.rel='noopener'; a.click();
      }
      setTimeout(()=>URL.revokeObjectURL(url),60000);
    }catch(err){
      alert('No s’ha pogut obrir el PDF.');
      console.error(err);
    }
  }

  
  $('reset-model').addEventListener('click',resetModelValues);
  $('student-id').addEventListener('input',resetModelValues);
  inputIds.forEach(id=>$(id).addEventListener('input',updateModel));
  window.addEventListener('resize',updateModel);
  renderQuestions();resetModelValues();requestAnimationFrame(updateModel);

})();
