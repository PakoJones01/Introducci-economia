
(() => {
  'use strict';
  const $=(id)=>document.getElementById(id);
  const hub=$('hub-view'), view=$('practice2a-view');
  if(!hub||!view) return;
  const BASE={price:10,sauce:3,wage:5,tax:0};
  const fmt0=new Intl.NumberFormat('ca-ES',{maximumFractionDigits:0});
  const fmt2=new Intl.NumberFormat('ca-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  const pdfBase64='JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUiAvRjMgNCAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Jhc2VGb250IC9IZWx2ZXRpY2EgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YxIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKMyAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYS1Cb2xkIC9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nIC9OYW1lIC9GMiAvU3VidHlwZSAvVHlwZTEgL1R5cGUgL0ZvbnQKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0Jhc2VGb250IC9TeW1ib2wgL05hbWUgL0YzIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNSAwIG9iago8PAovQ29udGVudHMgMTAgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5OCBdIC9QYXJlbnQgOSAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNiAwIG9iago8PAovQ29udGVudHMgMTEgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5OCBdIC9QYXJlbnQgOSAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNyAwIG9iago8PAovUGFnZU1vZGUgL1VzZU5vbmUgL1BhZ2VzIDkgMCBSIC9UeXBlIC9DYXRhbG9nCj4+CmVuZG9iago4IDAgb2JqCjw8Ci9BdXRob3IgKEludHJvZHVjY2lcMzYzIGEgbFwyMjBlY29ub21pYSkgL0NyZWF0aW9uRGF0ZSAoRDoyMDI2MDkxNjE3MTUxNyswMCcwMCcpIC9DcmVhdG9yIChcKHVuc3BlY2lmaWVkXCkpIC9LZXl3b3JkcyAoKSAvTW9kRGF0ZSAoRDoyMDI2MDkxNjE3MTUxNyswMCcwMCcpIC9Qcm9kdWNlciAoUmVwb3J0TGFiIFBERiBMaWJyYXJ5IC0gXChvcGVuc291cmNlXCkpIAogIC9TdWJqZWN0IChcKHVuc3BlY2lmaWVkXCkpIC9UaXRsZSAoUHJcMzQwY3RpY2EgMmEgXDI2NyBGdW5jaVwzNjMgaSBjb3JiYSBkXDIyMG9mZXJ0YSkgL1RyYXBwZWQgL0ZhbHNlCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9Db3VudCAyIC9LaWRzIFsgNSAwIFIgNiAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUgXSAvTGVuZ3RoIDIwMzAKPj4Kc3RyZWFtCkdhdUhMOFQzP0MnWWBhM11WQVtqWEBRMm1KXF8+VzhXKydWK0RIOHJLc2hqZEtnW3EpUCRpYjs0PilmXC9UczFIOF5sPClhZ1pZOS1cVlIjOz1mITchZHBIUUxYLVlfS0BwPyc6LHBJOGlGWzkrR1hZTiUiQW9ASyU7RDJfcF4saW0+YGY7YFk3c0JoIj4jS0xFKDIlP2A+T21PRURCV3NdZGhzXCdhW2VbO0BcP2JARScuNWlfa2spXXRTTmcnLXJGSTFXTD9pO0NDTT9LVl1zVDBvb2FEX1c3YjRsWT1zJVFoYGImNlAqKTwpLlJcaVdOKy9HYlpVSU8+cy9eRFlcYHAtISUtUj1sbUwkNm1vJjxMJC45alJlRCM+Mis6T19RLVY+IVYsYFE7a2krXCx1TWA9JGszTWY8K1QrVDcrRmlyKTRDOUQ5I3BsKWllWFhaK0wtXjtQKFZbOU5QPFxXMkJmckZTUTtia0xVUTt0VTBZZ1UqYCYkZydYWGZmLD4pOFFpQWM4JmMhPHQtdC46MUouNWRbMk1qVlA5Y01ydTBqa0JQQCUuQjorKTImR25tSjQ0cVVtZzAtKnM7Mj8sWVxII2J0PWZxMTNZJCtzOWU/TDY7Q0ddMmxQa2whU0A3MiY6alw7NUZGXkJcZyw+MS9sUGFEMFEhRSJAb1t0XjAkNkw5PSpHbjNEUWAqKDJvO1s+Y0omWElya0RNaSpHOE4qdG07KzBfNyVrKjdQRCswKWhSXk90QTJQLWdANipLRDNgaWVII2E5SilObktjTFFRIm5DK2xRIT51JkFIdEc9SD5aSzh0PyFBIiYxMXBxW1NfciouNV9dYTcjcFtNPCFzaV9VKkReKWx0YSZTaFoxNDNYI21DPSJnKG9hJWlRa0RhZlRBVWQ8SmhnSyZHITpLOFBRVTpOV2Q7MVA9QmNpSTBRTkNOdD9UaVdELiNUKGxAQlktJCRVKlhjUjVUbT1EJSM7c0UkUkZualo4QCM0cGBlakg9LGZ0VWMhMVBBLC90Ll5ORUNEMWMtTlktKihEISYjRCcyRUddNFosKUJuX3JaPyErVEhsSHA0VjBzIzk5XEw0JDI6TkMvOjlUblZRMi0+bGghSCMpOihaIm0mTVc/NEkzNC1dPmFuInJhJmgxWklVdWInJ0MlJitTckg2JkZUJSJ0PGV0UURGRzBDPz90PzMxZi8/UUVuUSU4QjxFKmFlXF83TjhTTCQ9bjIqRDFXSEk5NjIiTVZGakVdQz0nWWBoOlgkKWEwLyk5X0xXZ0Y8VkcoMTk+RlU3KDQlTWs8ay5SSDFDOz1JSzplLjdtSGNGY0VwSjRvT0A8bFsic0NENXJARGVaTT03Nkd1dSJoTmxeMCZZLj9aQSZxRkUmRihdL1dcJHBIVW4kdHVuVCwiUSxGW2JbVV9OdDVvNG5kIStVKidQRnEiNXJSZU1DUmlhdT48NEhFLENQOGFvXS85JHVHTDdpXmYtOUZ0OjZpMC4hKXJlTHBHV186JEAqLUEiQ11tQHVTJ15UTmVGTVZiN1t1clIoWywzTkJhIS1iQDY6bCQ9KTUoJW82cVclKWFFdVBLUHRzOEdZUEhLa3UmbT4wc2hpZ1QudGJjYF06VUFiZFtUZUpxKWJaVD8kKCdEP2daODFzN1VqaWZiRTpQZ1JSISspSlYjYGRRXihfZHFjWj9iaVJnSlRIO0FUREFgMGEnNj4sXTBLa0RKXy1FSCNLUSouPUgvNyZmTG00Pl5wQXE3XzY1QUcpNVJvI2wxMyMtbD5vXmpNW107ZytZbCFyOSRnVGEkaFkkbGJfZWVELyMnImtmO1xjMj1bRXJ1NmY9WkBJQG9AOF4+JlRiSyhkZTtDLThvbVRcLCkybDoyPUQia25dUDNNXCstQmsjZ2tkcilYKlFgIj1AVElUP1VBXnU0cWtuT0dtWyYxXm5CMDdNSkUwQSZPSkgvPSclWClUI1UyOWpgNFhfQic5dXRKWDdUTGtqPXEpcCgzaSNkIiJrWDo9XUooQDpuY3A9Nk1RS107VVguclkwOHAlUz5xRW9DOlZhayVgOzQxV2VJUkBIOC80T1oqKXBoUEJzX1tJLCZkTTRROHA5PCg2cURFVEgjbCVrZ209LidgRkQ3TjJXTm1FLClxZ24oYGpYY0RWQnJGRSlpcUZNazhccDJqT0tkbzc3I1FpOzRKLGc+InU3aExcPChKLTY+Y3FNOXQ1ZT9cRl4iSWBRJklQaUstSSZkQ1A2b0hbcF5Pc2o+RHI9PFhxLydeZk9WTmdZNGtdJyJfZClmRydXZDRlTTNCYFkzMzxuNlFhYWtIJGtuKm8uXjoyMVtzU2wsdEdkRG0+bFI7P0Q7SU1TXXU3SEhKLk9ITT1xYm1eWTlUUE1aWFlfWmtGJmtab0xeUCpPbjY6NGhhIjBOcWs2YGtPSkotVSxGKl5fOCI7PWRpa2daOiFVcVo7SG06KCNHYFlycVc3UmIuNXU3dG4oYGRYQlFQImRHXEFbSmxUKlBzK2NaSl5xS1FvP0YtWTRUQlJMSzNna1FeUEYkV15IW1slZzZYQDkhX29QKV1ZXmBeZWZxVGJjMW9oVCdUckRhUDtXP2QkVm9GbUElYlZdTXIqKkw5U15JRkxwXU0iK2tkT08kaF9kS0dWKk5eK05NVnEoITlVSjY8a1V0TSxvYV9HQ1xgTn4+ZW5kc3RyZWFtCmVuZG9iagoxMSAwIG9iago8PAovRmlsdGVyIFsgL0FTQ0lJODVEZWNvZGUgL0ZsYXRlRGVjb2RlIF0gL0xlbmd0aCAxNzU1Cj4+CnN0cmVhbQpHYiEjWzlvbiRlJkFAc0JiZz9tNFdrTiZSa1RMOFwsIVx0QCcnSkJiL15sPFNNMCgvZyQyV3ViTEFKLio6OW1YIUxbSClbVF10RlpIU11TcCZWXiJAcixaIVNdaWBhZUltdC1rWywrYEcidD9cM2QmWmorZGsiVXU3QDoyKj09LW1DLF4/LzBKJ0VTKDUwbCZzOyVVYD0qYEVzXj1nWj1RPCldKls2KENaOC5YRjtlUCVDKE0uMFhGUVhQdCkjcGFUTzM0ajxidCReZWxjWDhaTS43X09sQytuNzxZZFFHY2c/LjhfWkcxUSQ2WjtkOz06SW48aU07cV4oN1ttUWZnO0o4JnBORGFyQEhnYD8tbDBTRXFCTiw3PyE6JUErQyY0aU8hZjszIWViUTdkQ1c5akBCZHVJI2lJRiw7NE9KNS1xXjg1YVJQXzxYIzAqb01halhUJV5BTDEwaCJxVURXSEE/VlpGSzZPLz9vbytbbyw7NFw4cC9VRGw2ZDk8RDVpXC1GWDdoNU5CKjM7KTRuVWQrX2RfPCxHSSg6PShyKzNyZkozY0RfTSNMLEpIbmRfbnFyVS41ZS9tbDFMWXJBUlRQIW9obyglZUk/Z0A2TiZQOV9ZPkhNWC86RjsrdT1YZCE5Qkg7YXFMZzc4TjUqcF5JcHJOYDhqaj1kYidJSzpBaSxVI1o2NTh0PDVDQl4hI1ZGSF01Z1ZKZm5MNmRrZkxNMmplZjpJaTJiOEModUVoK11qOyhVQCErMiFsTjxpUmZQOWQ7S0FCY1k1PFxyXzZpI0MjQD1bJiVgWGosRS1EamdRKGRRNXVfYjdcW0QpRVFDJUY3YzM2KCtyXnRdTixUXTdTWmowcDFEWC44S011X1FZOz9RaU4yOUUvTWhiaidrOUNJVzAyXDVlOzhYPSYqRDtgRVRZOlNISGYxTlE+PldQTEJzQUdlJ1RLc0YtXDA6PT1vaFYyPFhKZSdZai1gSDxaUjojQWtkSkJJXGEiZ0x1VyY1Qm5DVG5gQTwjM05AR0pTT0FJUzROLDlyUCQiSm9GIiluOCtpKzZdLWIlW1RAUjZgL1dhJUJgOCtXLWB0ZldDZWViP3AjN24ybGYzPkNcM3IpKlltZWomTkJAcTdFaVIjUDspbThDIixnR15DZjg8T1tMTCxZdEN1KTNkdT9PRGtaKWQyPT0zIyU/RyhiYydZLlQ7JXRJLjMzZklQXylzcj8hWzxGb1dVKkU4RlMjcjxPTlhYN3RMVTNcOjwwXXJfYF1XS0w2WFlaYHFjTi9yUWs0cVpFQiMkRkVDYUsmMk5hZTEnX25oSVpMXU1AX2o3SFZsNzgibERxdEZbY2EqZDVrOFZwVE1wLi8iSl86Sj9bdGdCWEpNZlFkailmbFtOdDxwXFFLOiRMIyVzWkpnJmgkIShgOzpiLld0JkBwLF9AQFdGQ1E4MXRBNmBqK2A7OzRdMEt0KC8rSHVRXEonckBKLl0oPF1SUSlORD85QENoXGpAUWRcaEc+aC1QITNIZmo4bHJJLTZuZy5hcVk3aFoiZEtnSi9IP0guTz5JUEBdZ1RTaTQ7bG8kQFJOb1lTL0JtUS5ZWGhQVjUjVkIuYio/LWBDUWVxWjNpS1Y4Y1BzbFY/InRUNmhzaytbQ2I3MlVcMU1uJjtBcCpFPVkuQkRNQnJhNUNSa08kNSNNRTZNOVBySkVQXWwwL1osVj44VGw3QSIuPlVqQXEmW0hiPTshKiQ2XlM6K1l1NSgmWUE8QFdDOVFnJU5EMEEqOThJcXRTIz9jMzs2RTFqIW82WXFIZ0RRJ29USCVWW0FbLSgzP2RoOiNTTCFodFFnSXI3ZzkuZVlScks6W1pZRCkjWSNVOT5dWyhwPkFcQXJBbHBWIzBHOSxgJ2w+Wl0pIz42b0srQ0F1OCVySFNSOipXUk5tUWVkMCJwUiYoZWoqNT42PnBIQUMjXmdtdDg5SFhWai8pcFkqMDgxXDIyIU5xcW88WWEuODE2KEZRUko+JjBzLl41OHFkb21oUCdbaVxgVUlCZG8qRWV1R2hqWSNUKjJPWEUjRkcoMUhLREw9RVpWdHFVPkJDZE9hb1tYWXRlK0RBSGdkMzFWbE51XEEqVVxGTlFDYGc8R2pNSSYsSVJEXCQ1MGd1RE8uRDlEKElWJmxhYmJraVJ0ZzgpVWpoWF5eV2ApcW9PdVAvR05VbFJKRSRxclQzMzchXypuLCkoYkU4WiclL11dMmpIPTFkNVtRQ1ZvaWVnWCwiVj5nXmpxLSRJWzNYXU8rVzsnRipIOmpUaGVObnJySU9iNjdDU3ReSjZdJ2NGUHFbXzthTz1efj5lbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCAxMgowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwNjEgMDAwMDAgbiAKMDAwMDAwMDExMiAwMDAwMCBuIAowMDAwMDAwMjE5IDAwMDAwIG4gCjAwMDAwMDAzMzEgMDAwMDAgbiAKMDAwMDAwMDQwOCAwMDAwMCBuIAowMDAwMDAwNjEyIDAwMDAwIG4gCjAwMDAwMDA4MTYgMDAwMDAgbiAKMDAwMDAwMDg4NCAwMDAwMCBuIAowMDAwMDAxMjE3IDAwMDAwIG4gCjAwMDAwMDEyODIgMDAwMDAgbiAKMDAwMDAwMzQwNCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9JRCAKWzwzN2M3MDYzNzJjMzlhMWM2NTdhZjc0MDliZGRhYjRjYj48MzdjNzA2MzcyYzM5YTFjNjU3YWY3NDA5YmRkYWI0Y2I+XQolIFJlcG9ydExhYiBnZW5lcmF0ZWQgUERGIGRvY3VtZW50IC0tIGRpZ2VzdCAob3BlbnNvdXJjZSkKCi9JbmZvIDggMCBSCi9Sb290IDcgMCBSCi9TaXplIDEyCj4+CnN0YXJ0eHJlZgo1MjUxCiUlRU9GCg==';

  function parseNum(v){
    if(typeof v==='number') return Number.isFinite(v)?v:NaN;
    let s=String(v??'').trim().replace(/\s/g,'');
    if(!s) return NaN;
    const comma=s.lastIndexOf(','), dot=s.lastIndexOf('.');
    if(comma>=0&&dot>=0){const pos=Math.max(comma,dot);s=s.slice(0,pos).replace(/[.,]/g,'')+'.'+s.slice(pos+1);}
    else if(comma>=0){const p=s.split(',');s=p.length===2?p[0]+'.'+p[1]:p.join('');}
    else if(dot>=0){const p=s.split('.');if(p.length===2&&p[1].length===3&&Math.abs(Number(p[0]))>=10)s=p.join('');else if(p.length>2)s=p.join('');}
    return Number(s);
  }
  const roundN=(v,n)=>Number.isFinite(v)?Number(v.toFixed(n)):NaN;
  const mod=(a,m)=>((a%m)+m)%m;
  function seedFromId(id){const s=String(id??'').trim(),last=s.slice(-4);return /^\d+$/.test(last)?Number(last)%10000:6380;}
  function pars(seed){
    return {
      SA:0.45+0.06*mod(seed*37+11,997)/997,
      SB:-0.65+0.08*mod(seed*41+17,991)/991,
      SD:-0.75+0.10*mod(seed*43+23,983)/983,
      SF:75+mod(seed*47+29,977)/977
    };
  }
  function supplyConst(p,m){return 100*p.SF*Math.pow(m.sauce,p.SB)*Math.pow(m.wage,p.SD);}
  function qSupply(price,p,m){
    const S=supplyConst(p,m), net=price-m.tax;
    return net<=0?0:S*Math.pow(net,p.SA);
  }
  function visibleQ(price,p,m){return roundN(qSupply(price,p,m),0);}
  function visibleRevenue(price,p,m){return roundN(roundN(price,2)*visibleQ(price,p,m),2);}
  function readModel(){
    const p=parseNum($('supply-price').value),s=parseNum($('supply-sauce').value),w=parseNum($('supply-wage').value),t=parseNum($('supply-tax').value);
    return {price:Number.isFinite(p)&&p>=0?p:BASE.price,sauce:Number.isFinite(s)&&s>0?s:BASE.sauce,wage:Number.isFinite(w)&&w>0?w:BASE.wage,tax:Number.isFinite(t)?t:BASE.tax};
  }
  function resetModel(){
    $('supply-price').value='10,00';$('supply-sauce').value='3,00';$('supply-wage').value='5,00';$('supply-tax').value='0,00';update();
  }
  function scenario(overrides={}){return {...BASE,...overrides};}

  const qdefs=[
    {reset:true,q:'Fixa el preu dels espaguetis en 20 €. Quina quantitat s’ofereix?',unit:'plats/dia',kind:'qty',m:{price:20}},
    {q:'Ara fixa el preu en 10 €. Quina quantitat s’ofereix?',unit:'plats/dia',kind:'qty',m:{price:10}},
    {reset:true,q:'Amb el preu en 10 €, quins ingressos totals diaris esperen obtenir els productors?',unit:'€/dia',kind:'revenue',m:{price:10}},
    {reset:true,q:'Amb el preu en 15 €, quins ingressos totals diaris esperen obtenir els productors?',unit:'€/dia',kind:'revenue',m:{price:15}},
    {reset:true,q:'Fixa el preu en 12 € i augmenta el salari fins a 8 €/h. En quant canvia la quantitat ofertada respecte dels valors inicials?',unit:'plats/dia',kind:'deltaQty',base:{price:12},m:{price:12,wage:8}},
    {reset:true,q:'Fixa el preu en 12 € i augmenta el preu de la salsa fins a 7 €. L’oferta d’espaguetis augmenta o disminueix?',unit:'',kind:'select',answer:'Disminueix',options:['Augmenta','Disminueix']},
    {q:'En aquest mateix cas, en quant canvia la quantitat ofertada respecte de quan la salsa valia 3 €?',unit:'plats/dia',kind:'deltaQty',base:{price:12},m:{price:12,sauce:7}},
    {reset:true,q:'Fixa el preu en 12 € i aplica un impost de 5 €/plat. En quant canvia la quantitat ofertada?',unit:'plats/dia',kind:'deltaQty',base:{price:12},m:{price:12,tax:5}},
    {reset:true,q:'Fixa el preu en 6 € i aplica un impost de 5 €/plat. En quant canvia la quantitat ofertada?',unit:'plats/dia',kind:'deltaQty',base:{price:6},m:{price:6,tax:5}},
    {reset:true,q:'Fixa el preu en 12 € i aplica una subvenció de 2 €/plat. En quant canvia la quantitat ofertada?',unit:'plats/dia',kind:'deltaQty',base:{price:12},m:{price:12,tax:-2}},
    {reset:true,q:'Aplica una subvenció de 5 €/plat. Quin preu dels espaguetis fa que la quantitat ofertada sigui 4.000 plats/dia?',unit:'€/plat',kind:'priceGoal',m:{tax:-5},target:4000},
    {reset:true,q:'Fixa el preu dels espaguetis en 8 €. Quin salari fa que la quantitat ofertada sigui 2.500 plats/dia?',unit:'€/h',kind:'wageGoal',m:{price:8},target:2500},
    {reset:true,q:'Fixa el preu en 10 € i després aplica un impost de 5 €/plat. En quant ha d’augmentar el preu per mantenir la quantitat ofertada anterior?',unit:'€/plat',kind:'priceIncrease',base:{price:10},m:{price:10,tax:5}}
  ];

  function renderQuestions(){
    const host=$('supply-questions-body');host.innerHTML='';
    qdefs.forEach((d,i)=>{
      const row=document.createElement('div');row.className='q-row';
      const n=document.createElement('div');n.className='q-num';n.textContent=String(i+1);
      const t=document.createElement('div');t.className='q-text';
      if(d.reset){const b=document.createElement('strong');b.textContent='Torna als valors inicials. ';t.appendChild(b);}
      t.appendChild(document.createTextNode(d.q));
      const a=document.createElement('div');a.className='q-answer';let c;
      if(d.kind==='select'){
        c=document.createElement('select');const ph=document.createElement('option');ph.value='';ph.textContent='Selecciona…';c.appendChild(ph);
        d.options.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;c.appendChild(op);});
      }else{c=document.createElement('input');c.type='text';c.inputMode='decimal';c.autocomplete='off';}
      c.id=`supply-answer-${i+1}`;a.appendChild(c);
      const u=document.createElement('div');u.className='q-unit';u.textContent=d.unit;
      const k=document.createElement('div');k.className='q-check blank';k.id=`supply-check-${i+1}`;k.textContent='·';
      row.append(n,t,a,u,k);host.appendChild(row);
      c.addEventListener('change',()=>check(i));
      if(d.kind!=='select'){c.addEventListener('blur',()=>check(i));c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();c.blur();}});}
    });
  }

  function goalCandidates(kind,d,p){
    const target=d.target, vals=[];
    if(kind==='priceGoal'){
      const m=scenario(d.m),S=supplyConst(p,m);
      const exact=m.tax+Math.pow(target/S,1/p.SA);
      const center=roundN(exact,2);
      for(let k=-300;k<=300;k++){
        const v=roundN(center+k/100,2);if(v<0)continue;
        if(visibleQ(v,p,m)===target) vals.push(v);
      }
    }else if(kind==='wageGoal'){
      const m=scenario(d.m),net=m.price-m.tax;
      if(net>0){
        const denom=100*p.SF*Math.pow(m.sauce,p.SB)*Math.pow(net,p.SA);
        const exact=Math.pow(target/denom,1/p.SD);
        const center=roundN(exact,2);
        for(let k=-500;k<=500;k++){
          const v=roundN(center+k/100,2);if(v<=0)continue;
          if(visibleQ(m.price,p,{...m,wage:v})===target) vals.push(v);
        }
      }
    }
    return [...new Set(vals)];
  }

  function expected(d,p){
    if(d.kind==='select') return d.answer;
    if(d.kind==='qty'){const m=scenario(d.m);return visibleQ(m.price,p,m);}
    if(d.kind==='revenue'){const m=scenario(d.m);return visibleRevenue(m.price,p,m);}
    if(d.kind==='deltaQty'){
      const b=scenario(d.base),m=scenario(d.m);return visibleQ(m.price,p,m)-visibleQ(b.price,p,b);
    }
    if(d.kind==='priceIncrease'){
      const b=scenario(d.base),m=scenario(d.m),q0=visibleQ(b.price,p,b);
      const S=supplyConst(p,m),exact=m.tax+Math.pow(q0/S,1/p.SA);
      const candidates=[];const center=roundN(exact,2);
      for(let k=-200;k<=200;k++){const price=roundN(center+k/100,2);if(price>=0&&visibleQ(price,p,m)===q0)candidates.push(roundN(price-b.price,2));}
      return [...new Set(candidates)];
    }
    if(d.kind==='priceGoal'||d.kind==='wageGoal') return goalCandidates(d.kind,d,p);
    return NaN;
  }

  function check(i){
    const d=qdefs[i],c=$(`supply-answer-${i+1}`),box=$(`supply-check-${i+1}`);if(!c||!box)return;
    const raw=c.value;if(raw===''){box.className='q-check blank';box.textContent='·';return;}
    const p=pars(seedFromId($('supply-student-id').value));let ok=false;
    if(d.kind==='select') ok=raw===expected(d,p);
    else{
      const v=parseNum(raw);if(Number.isFinite(v)){
        const e=expected(d,p);
        if(Array.isArray(e)) ok=e.some(x=>x===roundN(v,2));
        else if(d.kind==='revenue') ok=roundN(v,2)===roundN(e,2);
        else ok=roundN(v,0)===roundN(e,0);
      }
    }
    box.className='q-check '+(ok?'correct':'wrong');box.textContent=ok?'Correcte':'Revisa-ho';
  }

  function svgEl(name,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;}
  function draw(m,p){
    const svg=$('supply-chart');while(svg.firstChild)svg.removeChild(svg.firstChild);
    const box=svg.getBoundingClientRect();const W=Math.max(390,Math.round(box.width||500)),H=Math.max(350,Math.round(box.height||430));svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const S=supplyConst(p,m),qNow=qSupply(m.price,p,m);
    const yMax=Math.max(30,Math.ceil(Math.max(m.price*1.7,m.tax+25)/10)*10);
    const qAtTop=m.tax<yMax?S*Math.pow(Math.max(yMax-m.tax,0),p.SA):0;
    const qMax=Math.max(5000,Math.ceil(Math.max(qNow*1.45,qAtTop)*1.08/1000)*1000);
    const margin={l:55,r:16,t:16,b:48},pw=W-margin.l-margin.r,ph=H-margin.t-margin.b;
    const X=q=>margin.l+(q/qMax)*pw,Y=pr=>margin.t+ph-(Math.max(0,Math.min(yMax,pr))/yMax)*ph;
    const grid=svgEl('g');
    for(let i=0;i<=6;i++){const val=yMax*i/6,yy=Y(val);grid.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#d6d4cf','stroke-width':1,'stroke-dasharray':'2 3'}));const t=svgEl('text',{x:margin.l-7,y:yy+3.5,'text-anchor':'end','font-size':9.5,fill:'#555b5e'});t.textContent=fmt0.format(val);grid.appendChild(t);}
    for(let i=0;i<=5;i++){const val=qMax*i/5,xx=X(val);const t=svgEl('text',{x:xx,y:H-margin.b+17,'text-anchor':'middle','font-size':9.5,fill:'#555b5e'});t.textContent=fmt0.format(val);grid.appendChild(t);}
    svg.appendChild(grid);svg.appendChild(svgEl('line',{x1:margin.l,y1:margin.t,x2:margin.l,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));svg.appendChild(svgEl('line',{x1:margin.l,y1:H-margin.b,x2:W-margin.r,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));
    let path='';const N=130;
    for(let i=0;i<=N;i++){const q=qMax*i/N;const price=m.tax+Math.pow(q/Math.max(S,1e-9),1/p.SA);if(Number.isFinite(price)&&price>=0&&price<=yMax*1.05)path+=(path?' L ':'M ')+X(q)+' '+Y(price);}
    svg.appendChild(svgEl('path',{d:path,fill:'none',stroke:'#e8682b','stroke-width':3,'stroke-linecap':'round'}));
    if(m.price>=0&&m.price<=yMax){const yy=Y(m.price);svg.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#7a746d','stroke-width':1.4,'stroke-dasharray':'6 5'}));if(Number.isFinite(qNow)&&qNow<=qMax){svg.appendChild(svgEl('circle',{cx:X(qNow),cy:yy,r:4.5,fill:'#e8682b',stroke:'#fff','stroke-width':1.4}));}}
    const xt=svgEl('text',{x:margin.l+pw/2,y:H-7,'text-anchor':'middle','font-size':11,fill:'#353a3d','font-weight':700});xt.textContent='Quantitat (plats/dia)';svg.appendChild(xt);
    const yt=svgEl('text',{x:14,y:margin.t+ph/2,'text-anchor':'middle','font-size':11,fill:'#353a3d','font-weight':700,transform:`rotate(-90 14 ${margin.t+ph/2})`});yt.textContent='Preu (€/plat)';svg.appendChild(yt);
  }

  function update(){
    const p=pars(seedFromId($('supply-student-id').value)),m=readModel(),q=visibleQ(m.price,p,m);
    $('supply-qs').textContent=fmt0.format(q);
    $('supply-revenue').textContent=fmt2.format(roundN(roundN(m.price,2)*q,2));
    $('supply-net-price').textContent=fmt2.format(roundN(m.price-m.tax,2));
    draw(m,p);
    qdefs.forEach((_,i)=>{const c=$(`supply-answer-${i+1}`);if(c&&c.value!=='')check(i);});
  }

  function openPdf(){
    try{const raw=atob(pdfBase64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const w=window.open(url,'_blank','noopener');if(!w){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();}setTimeout(()=>URL.revokeObjectURL(url),60000);}catch(e){alert('No s’ha pogut obrir el PDF.');console.error(e);}
  }
  function hideOtherViews(){['practice1-view','practice2-view','practice2b-view','practice3-view'].forEach(id=>{const el=$(id);if(el)el.classList.add('hidden');});}

  
  $('supply-reset-model').addEventListener('click',resetModel);
  $('supply-student-id').addEventListener('input',()=>{resetModel();});
  ['supply-price','supply-sauce','supply-wage','supply-tax'].forEach(id=>$(id).addEventListener('input',update));
  window.addEventListener('resize',update);
  renderQuestions();resetModel();requestAnimationFrame(update);

})();
