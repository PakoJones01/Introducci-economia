
(() => {
  'use strict';
  const $=(id)=>document.getElementById(id);
  const hub=$('hub-view'), view=$('practice2b-view');
  if(!hub||!view) return;
  const BASE={price:18,income:20000,taco:6,wine:20};
  const fmt0=new Intl.NumberFormat('ca-ES',{maximumFractionDigits:0});
  const fmt2=new Intl.NumberFormat('ca-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  const pdfBase64='JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgOSAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago1IDAgb2JqCjw8Ci9Db250ZW50cyAxMCAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCA4IDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9QYWdlTW9kZSAvVXNlTm9uZSAvUGFnZXMgOCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjcgMCBvYmoKPDwKL0F1dGhvciAoSW50cm9kdWNjaVwzNjMgYSBsXDIyMGVjb25vbWlhKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwOTE2MTczMjU3KzAwJzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwOTE2MTczMjU3KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChQclwzNDBjdGljYSAyYiBcMjY3IEZ1bmNpXDM2MyBpIGNvcmJhIGRlIGRlbWFuZGEpIC9UcmFwcGVkIC9GYWxzZQo+PgplbmRvYmoKOCAwIG9iago8PAovQ291bnQgMiAvS2lkcyBbIDQgMCBSIDUgMCBSIF0gL1R5cGUgL1BhZ2VzCj4+CmVuZG9iago5IDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUgXSAvTGVuZ3RoIDE5NDQKPj4Kc3RyZWFtCkdiITtkPWA8KFImOldNRDBvdCkpQDc2ITlXInFoTF9eU2lkNWkoZSU/YXM6bkAlXyMpQHE1L19HPVojKC86JFZqIjExNm0udT8nUHE7cyItJXRDU1c5SlYtKkc0PW9fImoxNHMmIVJfO10rOGtvZ08uaWhfJzpVaEpJJW5FT2NOVD1xdENPK2lRRVInSi5kcT0rVHAiXDVpWFBRJGorXVwkXzBeOUksJmlBS2pjJkpFUWFubDVAPzJOXz8xaislJ1IxKyY1WVAtIW50YVVDci04NzgtT11RIzI+V1svck4pXCxsNWRzST85UUkwdWQwampALHBsZ3AmUGJeV0pYMUhWKD1RJCNLVl5sb3I4Uk5TMnRHbWAuXz9JKi5zP0NNc2Y8SVc8RyIocGZTcidSRTAjK1t0bC83Wy1naUtnOTtfJDVBNGtdV2MoSExCbFRnSitrIUFuSSx1UVU6ZCRoZmgyN1hhWklIdSxYbzgxRSk/PXJhbyE4L1o3U19pS0lgU28oYk9cUWtRLjpgN1JMW0xiaD1JJ2BeX0VHWGAyJDYjai9qIyUzL0BTRmZHJ2k5az1WZGdPaSpBLmg7P1JvMy5DbDIvIThDMFAyYSxUOVFtPzQkVEFRKi0+M0hyJz9bQmN0V29lOi0tOnIoISUndF0qRyo7LkwvdCMndDlhVkxyKUdYYSZGNlxPX2RUME1DWCdtQU42IVU3Y0BOUFw0Ny0xXCNgT2xRYT9nIWVRRFtdJk1MP1dEKDYzKWpLYnIwJGRfPkxIPzlyPktRL3RrTm4sJ1IoIzVeIyRZLCctbWM1R2FdbFAlTyZVdGBGPj4haF41ciQlX2IjSihQbkMpWVNfaGpeVC9LVStrQ2UrWjdOSyZBNDRMcDVpSCIkUzlLJit0N2ZyYS9DRFdycTFfU09sdWFdazkqIls0ayNZQjtGNHIyLjgzIkpgRD8xNDpSbiQ7TyRpRVx1O1k+cTxyU2ZzKnIvKmghXnUhMUJOJiwsXyokR1I8KGZkcUNySWYvWkI0PkxhQVI0OWVqTFxMT3FXNC8uUEZCYmx1ZjdNcEg9bkxXdWllUFNMZVduJmhDTTMsISMiJE5DLk0vJV1EOClqdWZuYCdkRyhycyhnMTBILitmXSluWy9sdT1UNENxcDxBQkJwUyxCXS1VLzQvRzhBZ3RgYyxcZSFGOV8jSEBIZCFlR2I2cmgyQFdBWUxAZylldCclOmwtLmNzPDk0VHBEQSc5TDhLLyJoXFg3S1A7Qm8iYGMpNHJyZ0BiZWsmOi1rUlg9bjxPNjYpO04hW0dhPCFDNl03QkpSTExRaDVSIypMO25oLiVIb0IxQ15XUUpNPHUjNFkxRzs1TjA8bk5EZm9FQTxTa0VeUGszTWMxKEdgJVcxYzs9cE9wXTJHNUhldVlfcFdHaSg9Jk0wSyM3NCJpckVqOi1EO1QlM2VIYkNpUyI5dGJJLTZcQl90Sl5KSCQ/Mj4oTmUvVSQkRmRRXWc4V0VIOTVyWU5RcjQxbkdZSFk2KmkqXFBrKURVOVtvR0twUko+IlspJ1MrbloqPkomNjs9ZzAyXiFPViNfcT01MFVBclpCLFoxKml1PDlPJFoxMiNPbzdhRV1MZ2xvPkhFLHFGcUtealVpWnJKUCZNJnJbTkA2R1tzVGs0JzQ1NlQ8Zm0+TVpHXikodF5VKj9QZ2ZgUUhRUDYiL1FIWjw4aDVfcGgrIkdNQ2IvNT0iNEckOjNMXD1TMS10MUwjZVQnMGEoSlJvXkBBYC1uVnMmXzoxXmZcO3FeQ2QpVUwkKkVSdVA5R2FQN1VrKW5iWmdJOz50Ql5XWyskRiYiXHBVWWgsXVJySXBmZjZKPUNiSTg9ITlgSGQvNmNaK1VBTlhea2JNXT9LQWBnQE1iNFAnMiM+Nyw5WGIoMUUvQSI9bjRRLDNJL1lEM1hdWkw/P1dKbGYkWUZgOzhaZyYwJzFcLyJYJUxwTmVLQWhXb1MlP2QuaGFTL2BqMSVxRGYsXigxKzNIK2s8ayI5MGtzbDxBQT4tI01FMG08KFlRMlJROyZySyJsJ0E0PV9EOFNgYEpFUy41XzhRcDheW2RaWk8ocWFnKDhacGpaZUsla0w4dScham9ESyZJblEuJidKSkNcYm8qTy0pJnA+bWJEazNuPChWXkRRaU1uUmVgX2JwcEdrTy9xI1g8TzIxOTdkZ0ldUyUzP1htZydoOT1SRkFCRC9nbFZeaSgtTl5DN0ZHPGBHIjpYUmRbaEZaUW1fSUs7NHMjWDtTc2VnP1RRKXMiQGw9KmBMIVNSWChmT04lVS1mRi9ILm1NN1skLFUvbHVdKkdFQk0uPipSRyYzNFw7MDtnTitOYnIsVkN1RC5Vc25SNVMzTklddDFqO0VzJCtkWm40WDQuW2QhJEUmOiUqQGInLlAsVDxTYzA3Sm88LTtuUkUzMmtwZFxCS2pBQSxTbzpDRmA1XkZQPlJRblpiVlgwRlEkYDcoTUozIi4+Ym03YmkjLFsvLnFxJWZKQVFgRGk8YnRGP1tSaVBeLV82amksL0JkJExqUCJXckVfbSM8XVkrM3BNXHA6MCJbJ28mPlF+PmVuZHN0cmVhbQplbmRvYmoKMTAgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTk1MAo+PgpzdHJlYW0KR2F1MERnTiklLCY6Ti8zbSVeIkgoX1lhYTFPV3FTU1RgRlRTPl5AUEpMJjs9JWdnPCJXRllrdWZgYSRcLz90PUMya0hCYFswMVshbVtjUjwiPG1iNG1lPFJbR2RFJykrIVFMWC85X1pFNW4ocXRuOiFDMFQqOU0xS2gyOzJjNkpwI11ZXiNtQjBjbV5BZj9nXCNUNkRVYCU0SFIrdF1JPixgVnRtR2BQSmwzcFlEREMmJWc7bVQnai1UITBEbitBVW8/QTljKHFuZjchSl1iJ2ojTmdtNlU9LGNcVVE1LlhEZCNCcDtHLWIkclNvUEI9WHIoWWhBJGk1IkovKF41cGhYIm8lUUJDJCNbbHQqQCFOIiMoVVVIXjNcUShJTikoNyZUJ1p1PTBHcF09OC4vSGRPSlI1YVZlTGhCJk9vV2RWXyFIQ2IkdUskNDtgOjA0Y0NUZzo1Y21gXmBfVkhCOD1BZSVjR1RoLV10UipEVickK1JeUSgxJTE1ImpnNl0rLlx1QUlGXSdMJkJTa0NJLjdSYEVjZWtuYVFcalY+R0EtXlNUX3UtKClANkhTPitEWXEmXCxjQyJrSiMiOFZvUj9ORThNITNYVG0yMDtBY1gnLTElYU1AOCM6aiYpOjBOQUlVXlU9OiNBMzVncj9oL1I/ITxNUidLQihpWWtXZjw+a2BUR0giajRiVzo9XEAsQ1tWMCZjQEUsQFgpQmI8UydDNTIqTm1XWShIKSRYTkBLdC1eRSlwQ04+JFlrVG5XI1pZZEY0QT8xRjpHTytiJiNsPTBaSnMhXEdaJjQ3Wi5KL2NFKGVxJWcoLzdAb2pOV1o6PDtoP09DVkg5W0wnYUEoTUZuJjk2cS01R0Vha2k9IllSUSZWZkFFPl1dVzlocjohaTpJUDMsIWdiQylDSnRQRTcrRyViOThLX15mXG5ALS9NYDFdLC5nI1hrPyJsIVRkXXUsRUU7J2spX185cnFNOnQ3dWpgZDU4YVUmS00jOmJXb2ZxL0UhKXM8Kj91aisoNCh0TUNnM21RXkkxRWlIWFJqRS1IXmxpaXJTaVhodDBQLSZwU29jczE7RXE3OUxQKHFjVyoqNV4tWiVhPm44JG0lQ0E9QCxXLCdaJCk3VGNia3NlaVIsclczKyhmW1pIK2MmNlNeOzZuRUFRODFIQktSMlJYNUVkQUc+UkJwR3IpT0NoQjljVideNidsallZXCVORzw1dTpdXD4+NFBAIWxkLjo3Ty0mMltcNEo7TG4pYV5YWV0/cjRfTS8mZCIsKVIvMzNFNzdwZkFJKlVldG8lNSc0UlpoamFsTCZKMyo0TlckVjNWJD5mKCtKQT9nRVo3ZylvNGBFWCtpaDExUz4waVQvZGJMNVJhZU4jTl5jVjJKX1dbLmFdQSg0aFxRJkQ5bWUmKG0sU1phRmxgTSVbaGJhPitAZl1aX1JXNzZhcFZZVEo2bl1RWGFjMDlRYVI9bTwvQD9ZcFskcDpDWFEoOClcKCdkM1lkKmRHXGg8UGFnNnQ9aFhnRklyU2RXZzpuVT1pWHJDQ0AlTWtHR2w8TVcmZFJUV2otaHBaN09XWFAxU2Y0RlkmSCU+QXJVdV8ydFBtKV0hP05PRlkpUFNfIiQ8Sk5TOWA1ISlTISJbZ2hdIyxHYW9UXlJwTysvaEcuYFVEPExRSTRNUmxsR2JsKVlmQ3JVPVsmdENBK2s7XTNYYWp0bmVmWzIyPk1rWkBRQGxUXCNqUS8ndCk+RlZwdFJNPis8Oic1cWVgSU5oWSskUD8mdSQxV2ckJF85K3AzQy5NcXRvaVo0LzdUMFBzYjVwazVYVmVuZFNtSDFER0ciXmIsZ1oibGdUUk09IXRUVmI0UjBMJT8oO14wb3V1R0RmPFpFaEB0N1tXcFQ7IydTSG9kNilOMlRscCgqbGMjIipJPjswXC1EYG9lKUhUUU03WENYV15gXzkwQCo+XWJkWFtFdC1QZk45VGgjVVs5WjlhYTxQXGhXTjsnQGNTcmBOdHBBKWBWXD1qPiQzOTAqNjJyMnVSXjNsb0VcJSsjLGlQXE4jYChIW2g6MG9AKlc0WigmNylMaFcvJGY4Smw9b3UmXURyODF0UFpcclNwW2g7UCNKVERxZyI7Jm9UQ1s+Qi0kOS0hQTFtLGZsJHFZKzNKVWQ8MkQ7dU5BVGlXSkdbKmwzQEU7ajpLKVxLa21oP2g6TUtfYlxMQHJGMmhgX1BjOWBSOTdMLDxmIidldUgrcl41K0svNCxKKDcjNFRgbilxMFdFXCY1Uy5sOHMvTkgmRG4uVUAoVnQ6SnBwc1QoVSZZZStMIWdvQj5GXV1YcGYwTyo2ayRKLGYmN2x0PjA2LCpyYnVrRy5gKCZpNFVSXmw9NENZck5AMCpNUFFUajVmYD5vOnFwbFAqYVxGWz05VSM7Vk1mMmZXI1Q+PyosXU88bmQpKTlERypNPVkpJiZOLjlITSxCW0tGZDg3SGdVY14iLmtNaUwpMCRmM203Q3Q0UU5cWGddRmNIPyVHN0U1dEpCJ1EtSWJkaDEoYDdhSGo/PDJOMjsmKEckM3NNKCk0YVUqMzI4ZCxyO11ETUhsMn4+ZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgMTEKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDYxIDAwMDAwIG4gCjAwMDAwMDAxMDIgMDAwMDAgbiAKMDAwMDAwMDIwOSAwMDAwMCBuIAowMDAwMDAwMzIxIDAwMDAwIG4gCjAwMDAwMDA1MjQgMDAwMDAgbiAKMDAwMDAwMDcyOCAwMDAwMCBuIAowMDAwMDAwNzk2IDAwMDAwIG4gCjAwMDAwMDExMjggMDAwMDAgbiAKMDAwMDAwMTE5MyAwMDAwMCBuIAowMDAwMDAzMjI4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPDY5MzJjZTM4MWFmZjEyYTdmMzk1NTY2NjhiZTQxNWU1Pjw2OTMyY2UzODFhZmYxMmE3ZjM5NTU2NjY4YmU0MTVlNT5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gNyAwIFIKL1Jvb3QgNiAwIFIKL1NpemUgMTEKPj4Kc3RhcnR4cmVmCjUyNzAKJSVFT0YK';

  function parseNum(v){
    if(typeof v==='number') return Number.isFinite(v)?v:NaN;
    let s=String(v??'').trim().replace(/\s/g,'');
    if(!s) return NaN;
    const comma=s.lastIndexOf(','),dot=s.lastIndexOf('.');
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
      DA:0.17+0.06*mod(seed*53+31,971)/971,
      DB:0.66+0.08*mod(seed*59+37,967)/967,
      DD:-0.85+0.10*mod(seed*61+41,953)/953,
      DE:0.17+0.06*mod(seed*67+43,947)/947,
      DF:-0.13+0.03*mod(seed*71+47,941)/941
    };
  }
  function demandConst(p,m){return 100*p.DA*Math.pow(m.income,p.DB)*Math.pow(m.taco,p.DE)*Math.pow(m.wine,p.DF);}
  function qDemand(price,p,m){const D=demandConst(p,m);return D*Math.pow(Math.max(price,0.000001),p.DD);}
  function visibleQ(price,p,m){return roundN(qDemand(price,p,m),0);}
  function visibleSpending(price,p,m){return roundN(roundN(price,2)*visibleQ(price,p,m),2);}
  function readModel(){
    const pr=parseNum($('demand-price').value),inc=parseNum($('demand-income').value),ta=parseNum($('demand-taco').value),wi=parseNum($('demand-wine').value);
    return {price:Number.isFinite(pr)&&pr>0?pr:BASE.price,income:Number.isFinite(inc)&&inc>0?inc:BASE.income,taco:Number.isFinite(ta)&&ta>0?ta:BASE.taco,wine:Number.isFinite(wi)&&wi>0?wi:BASE.wine};
  }
  function resetModel(){
    $('demand-price').value='18,00';$('demand-income').value='20000';$('demand-taco').value='6,00';$('demand-wine').value='20,00';update();
  }
  function scenario(overrides={}){return {...BASE,...overrides};}

  const qdefs=[
    {reset:true,q:'Fixa el preu dels espaguetis en 25 €. Quina quantitat es demanda?',unit:'plats/dia',kind:'qty',m:{price:25}},
    {q:'Ara fixa el preu en 15 €. Quina quantitat es demanda?',unit:'plats/dia',kind:'qty',m:{price:15}},
    {reset:true,q:'Amb el preu en 25 €, quina despesa total diària volen fer els consumidors en espaguetis?',unit:'€/dia',kind:'spending',m:{price:25}},
    {reset:true,q:'Amb el preu en 15 €, quina despesa total diària volen fer els consumidors en espaguetis?',unit:'€/dia',kind:'spending',m:{price:15}},
    {reset:true,q:'Fixa el preu en 12 € i augmenta la renda fins a 25.000 €. En quant augmenta la quantitat demandada respecte dels valors inicials?',unit:'plats/dia',kind:'deltaQty',base:{price:12},m:{price:12,income:25000}},
    {reset:true,q:'Fixa el preu en 12 € i augmenta el preu del vi fins a 35 €. La demanda d’espaguetis augmenta o disminueix?',unit:'',kind:'selectWine',options:['Augmenta','Disminueix']},
    {q:'En aquest mateix cas, en quant canvia la quantitat demandada respecte de quan el vi valia 20 €?',unit:'plats/dia',kind:'deltaQty',base:{price:12},m:{price:12,wine:35}},
    {reset:true,q:'Fixa el preu en 12 €. Quina renda anual fa que la quantitat demandada sigui 5.000 plats/dia?',unit:'€',kind:'incomeGoal',m:{price:12},target:5000},
    {reset:true,q:'Fixa el preu en 12 €. Quin preu del vi fa que la quantitat demandada sigui 2.000 plats/dia?',unit:'€',kind:'wineGoal',m:{price:12},target:2000},
    {reset:true,q:'Fixa la renda en 30.000 € i la resta de variables als valors inicials. Quin preu dels espaguetis fa que la demanda sigui 4.000 plats/dia?',unit:'€/plat',kind:'priceGoal',m:{income:30000},target:4000},
    {reset:true,q:'Fixa la renda en 30.000 € i la resta de variables als valors inicials. Quin preu dels espaguetis fa que la demanda sigui 5.000 plats/dia?',unit:'€/plat',kind:'priceGoal',m:{income:30000},target:5000},
    {q:'En aquest model, els tacos i els espaguetis són substitutius o complements?',unit:'',kind:'relation',options:['Substitutius','Complements']}
  ];

  function renderQuestions(){
    const host=$('demand-questions-body');host.innerHTML='';
    qdefs.forEach((d,i)=>{
      const row=document.createElement('div');row.className='q-row';
      const n=document.createElement('div');n.className='q-num';n.textContent=String(i+1);
      const t=document.createElement('div');t.className='q-text';
      if(d.reset){const b=document.createElement('strong');b.textContent='Torna als valors inicials. ';t.appendChild(b);}
      t.appendChild(document.createTextNode(d.q));
      const a=document.createElement('div');a.className='q-answer';let c;
      if(d.options){c=document.createElement('select');const ph=document.createElement('option');ph.value='';ph.textContent='Selecciona…';c.appendChild(ph);d.options.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;c.appendChild(op);});}
      else{c=document.createElement('input');c.type='text';c.inputMode='decimal';c.autocomplete='off';}
      c.id=`demand-answer-${i+1}`;a.appendChild(c);
      const u=document.createElement('div');u.className='q-unit';u.textContent=d.unit;
      const k=document.createElement('div');k.className='q-check blank';k.id=`demand-check-${i+1}`;k.textContent='·';
      row.append(n,t,a,u,k);host.appendChild(row);
      c.addEventListener('change',()=>check(i));
      if(!d.options){c.addEventListener('blur',()=>check(i));c.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();c.blur();}});}
    });
  }

  function expected(d,p){
    if(d.kind==='selectWine') return p.DF<0?'Disminueix':'Augmenta';
    if(d.kind==='relation') return p.DE>0?'Substitutius':'Complements';
    if(d.kind==='qty'){const m=scenario(d.m);return visibleQ(m.price,p,m);}
    if(d.kind==='spending'){const m=scenario(d.m);return visibleSpending(m.price,p,m);}
    if(d.kind==='deltaQty'){const b=scenario(d.base),m=scenario(d.m);return visibleQ(m.price,p,m)-visibleQ(b.price,p,b);}
    return NaN;
  }

  function goalWorks(d,p,given){
    if(!Number.isFinite(given)||given<=0) return false;
    const m=scenario(d.m);
    if(d.kind==='incomeGoal') return visibleQ(m.price,p,{...m,income:given})===d.target;
    if(d.kind==='wineGoal') return visibleQ(m.price,p,{...m,wine:given})===d.target;
    if(d.kind==='priceGoal') return visibleQ(given,p,m)===d.target;
    return false;
  }

  function check(i){
    const d=qdefs[i],c=$(`demand-answer-${i+1}`),box=$(`demand-check-${i+1}`);if(!c||!box)return;
    const raw=c.value;if(raw===''){box.className='q-check blank';box.textContent='·';return;}
    const p=pars(seedFromId($('demand-student-id').value));let ok=false;
    if(d.options) ok=raw===expected(d,p);
    else{
      const v=parseNum(raw);if(Number.isFinite(v)){
        if(d.kind==='incomeGoal'||d.kind==='wineGoal'||d.kind==='priceGoal') ok=goalWorks(d,p,v);
        else{const e=expected(d,p);if(d.kind==='spending')ok=roundN(v,2)===roundN(e,2);else ok=roundN(v,0)===roundN(e,0);}
      }
    }
    box.className='q-check '+(ok?'correct':'wrong');box.textContent=ok?'Correcte':'Revisa-ho';
  }

  function svgEl(name,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;}
  function draw(m,p){
    const svg=$('demand-chart');while(svg.firstChild)svg.removeChild(svg.firstChild);
    const box=svg.getBoundingClientRect();const W=Math.max(390,Math.round(box.width||500)),H=Math.max(350,Math.round(box.height||430));svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const qNow=qDemand(m.price,p,m),yMax=Math.max(40,Math.ceil(m.price*1.7/10)*10);
    const lowPrice=Math.max(1,yMax*0.035),qAtLow=qDemand(lowPrice,p,m);
    const qMax=Math.min(50000,Math.max(5000,Math.ceil(Math.max(qNow*1.5,qAtLow)*1.05/1000)*1000));
    const margin={l:55,r:16,t:16,b:48},pw=W-margin.l-margin.r,ph=H-margin.t-margin.b;
    const X=q=>margin.l+(Math.max(0,Math.min(qMax,q))/qMax)*pw,Y=pr=>margin.t+ph-(Math.max(0,Math.min(yMax,pr))/yMax)*ph;
    const grid=svgEl('g');
    for(let i=0;i<=6;i++){const val=yMax*i/6,yy=Y(val);grid.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#d6d4cf','stroke-width':1,'stroke-dasharray':'2 3'}));const t=svgEl('text',{x:margin.l-7,y:yy+3.5,'text-anchor':'end','font-size':9.5,fill:'#555b5e'});t.textContent=fmt0.format(val);grid.appendChild(t);}
    for(let i=0;i<=5;i++){const val=qMax*i/5,xx=X(val);const t=svgEl('text',{x:xx,y:H-margin.b+17,'text-anchor':'middle','font-size':9.5,fill:'#555b5e'});t.textContent=fmt0.format(val);grid.appendChild(t);}
    svg.appendChild(grid);svg.appendChild(svgEl('line',{x1:margin.l,y1:margin.t,x2:margin.l,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));svg.appendChild(svgEl('line',{x1:margin.l,y1:H-margin.b,x2:W-margin.r,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));
    let path='';const N=150;
    for(let i=0;i<=N;i++){const price=lowPrice+(yMax-lowPrice)*i/N,q=qDemand(price,p,m);if(Number.isFinite(q)&&q>=0&&q<=qMax*1.02)path+=(path?' L ':'M ')+X(q)+' '+Y(price);}
    svg.appendChild(svgEl('path',{d:path,fill:'none',stroke:'#1f6d95','stroke-width':3,'stroke-linecap':'round'}));
    if(m.price>0&&m.price<=yMax){const yy=Y(m.price);svg.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#7a746d','stroke-width':1.4,'stroke-dasharray':'6 5'}));if(Number.isFinite(qNow)&&qNow<=qMax)svg.appendChild(svgEl('circle',{cx:X(qNow),cy:yy,r:4.5,fill:'#1f6d95',stroke:'#fff','stroke-width':1.4}));}
    const xt=svgEl('text',{x:margin.l+pw/2,y:H-7,'text-anchor':'middle','font-size':11,fill:'#353a3d','font-weight':700});xt.textContent='Quantitat (plats/dia)';svg.appendChild(xt);
    const yt=svgEl('text',{x:14,y:margin.t+ph/2,'text-anchor':'middle','font-size':11,fill:'#353a3d','font-weight':700,transform:`rotate(-90 14 ${margin.t+ph/2})`});yt.textContent='Preu (€/plat)';svg.appendChild(yt);
  }

  function update(){
    const p=pars(seedFromId($('demand-student-id').value)),m=readModel(),q=visibleQ(m.price,p,m);
    $('demand-qd').textContent=fmt0.format(q);
    $('demand-spending').textContent=fmt2.format(roundN(roundN(m.price,2)*q,2));
    draw(m,p);
    qdefs.forEach((_,i)=>{const c=$(`demand-answer-${i+1}`);if(c&&c.value!=='')check(i);});
  }

  function openPdf(){
    try{const raw=atob(pdfBase64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const w=window.open(url,'_blank','noopener');if(!w){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();}setTimeout(()=>URL.revokeObjectURL(url),60000);}catch(e){alert('No s’ha pogut obrir el PDF.');console.error(e);}
  }
  function hideOtherViews(){['practice1-view','practice2a-view','practice2-view','practice3-view'].forEach(id=>{const el=$(id);if(el)el.classList.add('hidden');});}

  
  $('demand-reset-model').addEventListener('click',resetModel);
  $('demand-student-id').addEventListener('input',()=>{resetModel();});
  ['demand-price','demand-income','demand-taco','demand-wine'].forEach(id=>$(id).addEventListener('input',update));
  window.addEventListener('resize',update);
  renderQuestions();resetModel();requestAnimationFrame(update);

})();
