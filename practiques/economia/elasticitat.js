
(() => {
  'use strict';
  const $=(id)=>document.getElementById(id);
  const hub=$('hub-view'), view=$('practice3-view');
  const BASE={price:18,income:20000,taco:6,wine:20};
  const fmt2=new Intl.NumberFormat('ca-ES',{minimumFractionDigits:2,maximumFractionDigits:2});
  const pdfBase64="JVBERi0xLjQKJZOMi54gUmVwb3J0TGFiIEdlbmVyYXRlZCBQREYgZG9jdW1lbnQgKG9wZW5zb3VyY2UpCjEgMCBvYmoKPDwKL0YxIDIgMCBSIC9GMiAzIDAgUgo+PgplbmRvYmoKMiAwIG9iago8PAovQmFzZUZvbnQgL0hlbHZldGljYSAvRW5jb2RpbmcgL1dpbkFuc2lFbmNvZGluZyAvTmFtZSAvRjEgL1N1YnR5cGUgL1R5cGUxIC9UeXBlIC9Gb250Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9CYXNlRm9udCAvSGVsdmV0aWNhLUJvbGQgL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcgL05hbWUgL0YyIC9TdWJ0eXBlIC9UeXBlMSAvVHlwZSAvRm9udAo+PgplbmRvYmoKNCAwIG9iago8PAovQ29udGVudHMgMTEgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5OCBdIC9QYXJlbnQgMTAgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0NvbnRlbnRzIDEyIDAgUiAvTWVkaWFCb3ggWyAwIDAgNTk1LjI3NTYgODQxLjg4OTggXSAvUGFyZW50IDEwIDAgUiAvUmVzb3VyY2VzIDw8Ci9Gb250IDEgMCBSIC9Qcm9jU2V0IFsgL1BERiAvVGV4dCAvSW1hZ2VCIC9JbWFnZUMgL0ltYWdlSSBdCj4+IC9Sb3RhdGUgMCAvVHJhbnMgPDwKCj4+IAogIC9UeXBlIC9QYWdlCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Db250ZW50cyAxMyAwIFIgL01lZGlhQm94IFsgMCAwIDU5NS4yNzU2IDg0MS44ODk4IF0gL1BhcmVudCAxMCAwIFIgL1Jlc291cmNlcyA8PAovRm9udCAxIDAgUiAvUHJvY1NldCBbIC9QREYgL1RleHQgL0ltYWdlQiAvSW1hZ2VDIC9JbWFnZUkgXQo+PiAvUm90YXRlIDAgL1RyYW5zIDw8Cgo+PiAKICAvVHlwZSAvUGFnZQo+PgplbmRvYmoKNyAwIG9iago8PAovQ29udGVudHMgMTQgMCBSIC9NZWRpYUJveCBbIDAgMCA1OTUuMjc1NiA4NDEuODg5OCBdIC9QYXJlbnQgMTAgMCBSIC9SZXNvdXJjZXMgPDwKL0ZvbnQgMSAwIFIgL1Byb2NTZXQgWyAvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJIF0KPj4gL1JvdGF0ZSAwIC9UcmFucyA8PAoKPj4gCiAgL1R5cGUgL1BhZ2UKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1BhZ2VNb2RlIC9Vc2VOb25lIC9QYWdlcyAxMCAwIFIgL1R5cGUgL0NhdGFsb2cKPj4KZW5kb2JqCjkgMCBvYmoKPDwKL0F1dGhvciAoSW50cm9kdWNjaVwzNjMgYSBsJ2Vjb25vbWlhKSAvQ3JlYXRpb25EYXRlIChEOjIwMjYwOTE2MDg1MjM0KzAwJzAwJykgL0NyZWF0b3IgKFwodW5zcGVjaWZpZWRcKSkgL0tleXdvcmRzICgpIC9Nb2REYXRlIChEOjIwMjYwOTE2MDg1MjM0KzAwJzAwJykgL1Byb2R1Y2VyIChSZXBvcnRMYWIgUERGIExpYnJhcnkgLSBcKG9wZW5zb3VyY2VcKSkgCiAgL1N1YmplY3QgKFwodW5zcGVjaWZpZWRcKSkgL1RpdGxlIChQclwzNDBjdGljYSAzIC0gRWxhc3RpY2l0YXQtcHJldSBkZSBsYSBkZW1hbmRhKSAvVHJhcHBlZCAvRmFsc2UKPj4KZW5kb2JqCjEwIDAgb2JqCjw8Ci9Db3VudCA0IC9LaWRzIFsgNCAwIFIgNSAwIFIgNiAwIFIgNyAwIFIgXSAvVHlwZSAvUGFnZXMKPj4KZW5kb2JqCjExIDAgb2JqCjw8Ci9GaWx0ZXIgWyAvQVNDSUk4NURlY29kZSAvRmxhdGVEZWNvZGUgXSAvTGVuZ3RoIDE3ODIKPj4Kc3RyZWFtCkdhdTBDPWBgPVUmOlhBV2ZKYj1bTj1aPnVsI1x0Y2xaViZUQFFAO1hXXWlablhNUj5WJDRrLCk/ZikkM0xwVjxjV1xiSiMnJWw3IWgvQVZvNFQmK09TKWFSYS9FIyZzJ0lcVVE0XSJFSS9EZTI4aXA+XENAMChnRCs9cSFXa0JNdDJPMmspImNPOmopaistcFsoWjw9dEBBK2Nubi1RNlhMSmt0ZWI7MGlpP2VrJEowU2tQUkZFaUldM3EqMTtiamQuUChfOlIlQU9MYnRSWllNU2syIyVxbUI7Ikc/LzclbGo3IXVEUzZvWFpeOlNmP29EL1ZBKmFuTkQnNFk8LTAmSSVtI2o+N2NdTmZMOS0rLUpubjwjc0tNOXRqKCs7KE02NypkKiZzI1c4KShzKWptcSVlbC5IbSZkZTglMThLRSgxISkpKEhmSChVOyRNTVhtS1QhLyFWailCMGJhSm9TWDFnP01BRmM9RFdQbDw7YypSbzIsKi5gYG43azBnJkckSD0yW0dmNU4zI2JuKi1HOFRGakV0QXBfYXJuJ0g6ZDY7SW5KaUFwbnBqcnQyVFgsKCZiRSwzVGdxJ1EmNFs2SGwwI1dzM0JjSypnaFM5YDI2dWclaSQxPDhtKCYkPmduYkNmVkc6JWpRNC8yVTBtLVdwOXA0XWQlbGQsJGM7ZGMwLDFnamVpQkhRL1hHTGpcZDJJXzkialhMMGVVcDMrUmFYazI3WTcxLy5PWWAuK09nb0dbJUMxLVlqZSZZKVhcLksvTCMkNGMpc2RDOVQkZmorZCNwVUE/clFaKiJDcDNVYCg+RVs0WGBnSj8iKSEuXktDXiVVZmgjOVwxU0o5bHNmU2Z0MDg2VnVpQmo9dUZpIjw+K1NrUTVRajIkODxmLFBPI1MoLnJsT1EqZmkmUFZTTHRFOUNALmdYL1tXMSdVYlJoKVdKZUhTMD1MQi9GTFNySiU0QCojWWY3JF1mJFU7bz5hPD5mSktKNj48WHNuZS4xWVoxTiJpWGxHREspYF5uYik7VGwzVSZHNzI7PFhqVzNmdCdKQy8mWykiKCI1VmlHSD1sWi4yJlNEV1VxWj1KOlkmSUlgKUE/b05aIXEtLlJfKF4vPEk7Vm9tZTQnTidwdSg+QyVMRkRNQV9WVixFQmpkVyFHZDBWPUZeSShNU0s2OG1cJko7WEJgNTs5LiNZPDIsI0h0Wi43LFMjXCtwJCsjblU1NUZRWXRKNzUwbylBRUJXdSJTQ2wxa0hiQyNFWGY/KSQjL21uc2xyOSoxQGUyMyFOYFFhaCQtW2l1KGcsVWdqdWRMJWAxOnRCKlRwZilXQyheJGFvajYoRVRNPGsyZFluK2ddaEw4Yl5cUi5faCM3UlleUDQrUmRWQUFDWU1SQ0s0YWJvUykhX1c0JUZZa003UGNKTkloXCdodHJyPmozNzlsZzBmPzxAPE8rPFwhc2ptM1UuZWcvU3FqJkYxamIvKUJ0LDNvTmIkdVkiQnRkSG07OmNWUjM6bC9KWFNKL11YWTg9I05AISosMC9ZbDIiYWlXWjpnU28iQT9AXEJeXERMVDYqb21AIj8pTVFLV3I5MGZKaj0vP1hFJmhVYEBARUk+b1skO01MXStucSU8YmRPbFZYIkokLFZrRjA+aFdXTmhXQ2UjQFZNbWJDcG9jNmMuWFNQRERfPktCUXErVXA5SW5IMGxJTjRLS3BbOTNCdGs8YDIoc1NCZDRmQ1Zga0ElTk1AK1ZKbDxYWD5ZYTMqJmVAakUpKFRbQE8oQ21jITExNGo2SFRSYmchVD81TDdVUjhxWyZaJzJrUz90cChbR1w2JEkkblBAOThXakIjUE5UMzhDZ2gsMVw4NClhb3IzVFZwJ3IxUksnXllvY2VuLiZWOV9aLEoyciVvJkQldS5XS0A2VklcW2tRJCVfSmtgQHJKanI2YW1yYF9pRy02L3JWYFhhM3BbZ1FHVjAzUlVmRzhfZjhaQjZGWHIiPV1MQyFOKGAmWm02XEkiWDJxNkA2azhrU29nYyNvOyNKRSU8MjgmR25GY3Fpc3BtTllXMk9hZiVIdGJBRUsyI2VFJC5CTG5hak9BJExQb3EwQ2drSlQnTjVkKz4iYTY1XDheN0JMNywjZE9HQCNMU2FEXGs3KUUvInJAI2o/azwsWnIyP3FpdGxOTDYrbi8uYkROcVklM2YjPmFUIU8qPj9TUzs6UmxRckk9cl5YLHVYImldMVEtQVQhS2NUVGA+VycxVGJULGwiPlpGNURlQ1taPCY0SWlvUy43S1E9MS48dS1BZ0krZGJUUCEhNmgpdE4pSDRHNFpcVl0+PE9bJm1mNDgqWC9iaFg6SGEqWiNpUCY2XU9QQyF+PmVuZHN0cmVhbQplbmRvYmoKMTIgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTg3OQo+PgpzdHJlYW0KR2F1SExnTiklLCY6TzpTbHMldHVLK14rTDNjL00tYTZCRFs+YiEzXElYcmVLX1tKMVI4TkNLNCs1WzFpLCJTIjZgR29aaGAnPTs9QitLMTMwJEdjWzA2YSVwSyc4N0VyVlZmbChHcmZLWSpic0oiZUFGYkRHUVcqbklsS0paJmkvS1JEYVlNVypaIVlHV0FBX1ZQUj1oJz9ycUA2VzBAXS8xJmdxaCltaU87PmFuMmdIbmBcWytjZzVVPkglZF1TRTdCJFxTcW5NQDY7NSI+QzFPXVF1QV5zN1hGUFphM183O0ZsKy8oSmk/JmhTKzo0cVVQMjBCX21SXzpPPW5LS3U8VjpPSyI9W1JYXENHOEpUSidDaD80YSMkSiUlNVVYS1phXmtWJEBzXC8mUy9zdT1PTiNwbzszNGg5JDEzLytkdFxVNlVfX1U5LkJTYXVpIUZhTTRIZE4wbEcrX09RazVEZSJmcjQhSCM9UFliWmBJWj5MciVyanNmQnJUN25gV0FzODIkT3BZOyZEXScyRWcuUnQsWVcuUloyQUhxWlFgcl0raik+RU8pWy5MaEQwc0BAYEtBTnUwLTFEPUAwI29KMz1gQjNkaS1rQzFXdXEzLW4xXWUtMm8rcm4zPFJsW2VaJ2dcSiQ8W25tRU8iZ09qM0MwQUhSUklDKVAnZT5OJFRVYy1FJzBwTChjMWMyOHVDSjQ8ODI8QHUvUlhCYi0+bU5mbmA9RU1vSkg5KkBpNFw/YDozLkFZTj00QnRKN0NgK0tJO2pkUEUkN2tZT05tQ09yVEVAKGdubSRqJXItMkVxOkQ+KCtHNT0qLzZUazQ3O1ojRS8pdTxiUUVXIk41QD05KilSPmpdNThRVENuOVhtYj5bX0NAVitfVyhnITR0K2VCVGM1Uz4vKGRIJ1doPThKS18/OGprV2dnUTIoTGNdZUFkL3U7X183S2ZyImQiKWVKc2ZqXFxtOmAwW0lGP2JSVW9MSVpFQktuNGowa1JqQCo3XDwqVyM+KV89WmtPKSxIOF4idS9RLG10ZltdTy1eQyYnOyFyUyVTVyxxQ3Fjb28nYEAsaXQ3ci1KXERyWjoxP0JEIydWKTdeRSg7TUBvO0YyJk10bk8vVV9jTVMlUz9fQXU8NWFCVVJGLSZARjooPE5BIU5SMnJsLWRBQ0pZZzlPU0MyVS90Z2s1czQ5bzNHPnBLbiNgZ1BYOSdIQjI5bjRbOE0qUmZHW2pRJEc8P0dqNkwpX1dPSFE9MSYwTD8oXlY+U1FGUUhtKEgjPWpQQV0vTS1EKDFzVCkkUG0pUWs7S0M/RWZlKCZPSHI2UTVFY0dyRjZIW1ZDbCUyNERHMzIzJm5LXidkWGdUI1FUJDBVaSVyYXI9PHNaPDdwcV1XKXE5Wy1TZl1UaEBrQUxjKWIlMlBVJyc0TEolcCVgLGwkNjREKFFAQytYV2cyT0k9KnQmPkotR3VGdVdaO28sPDcqZ0RNUUMmbzIpWFYiK0tZKUFoKmZyZ2YnTzhLMmsmPWlfZj47SDEsMmB0J2U2c3ItVj1WOE4vQiVOJiJYVUFDOGQqNmBtaFJSXSZAa2I3SWNjOW9IRWZlXz5baSZCYWN0UWdVNG42MWwiXjU1PVc0SlUxSkE9MFhtRz87MF80NyomPyM6Zl1eOmI0UWdSJFJyaHReOzBZWSRlVUwzU0VMa1pPa2NRdTlzMCtMcWIvO2pvOShVVCFiLFZrbElSRVk9UStJM0w+VlBIVl10PSVpZ3BmL1ZPZ145ZkNMUzlCLU1EL2JkYyRTXDQ2TkdmWyhiQUpvV21iN0JrYFgzQ3FoRmExNipDdWxJJnNmcFdFP0dnUGYuVS1ZQWJrWWtyMz1MVStQUnIqZmlDNi1UInBxYWp1dT4zSUszQms9PVsrcXRcL1dyRkA7PmVXIi09cFg0N2NPSFVvU3JVOUJnYkVCQTZYMzJJZGotI0NUZDhFcj9tcmg9VjEiWThpT0xiVFhaOGBmUEFPOWJTRClbMkFDKV05bTZBc0UzXFAydTo4XiNHLkE+WVBGYnEmZiI8QEwqbGkiMURtWU5CNSVdYm5tN1kvXyY+MTZYI0xAbEwjaVAiMV9xKjZxUXJPSlxqTWRzcS1XOWxgIiRDS0RDMXNhdEg0M0xKMHE3Tm40YiFjb09tRkJqdU1KcFZlPV1PQjpkVkU+J1M0bXE5J2pJN1pNNlZWWz8tVFxwYkxFMidtYFpoU0IhRnRfJSIocnFoNSdfN2chYG9qaFU9QnEhYjJXNGs4ZnJYM3RxaDdmUDRmaGA8cC9dTEdkQ3E9LihfPCViYkdzZVlOYDMxJlM8aUA/J2ZjJzljPyZdPEZBJz0wNSs9Rik9TWNZSG5TVCU0RUZJSmJjVFRfKGcmcjguN3NAO11Bcl4tNDtXJVhhOEczU3UnX2pJIWIwLmQrbSxfTXBVby5uWl5WRihGWzZgRW5rbixgLnNhdCZiZj1QQ05jLTInVVZZcCJvQEVnISF+PmVuZHN0cmVhbQplbmRvYmoKMTMgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTA5Ngo+PgpzdHJlYW0KR2F1YFI5aSdNLyZBQDcuYmJaTF9BX0QiVlZpJnAwNkRAO1RcYEwsOyUsSydMSnAzM1NycWFwbzhPczFbOC8rWklxKCcoYG4lRiEmQ0JiSWBldDAyXGkpOiEnP1BrSSxrcStTXCxjJ1RXODoxKG9fRFY8Ois/XGRRJCtxVD4nYWBCNl1hPyxXTSdiaEMjcUFmKjduU0Q1Iko6QnUzZXVKYTRVZDJRTmMoM0EmLzNUczVtYTBkSlVhbVEqNXIzRjZLOUs2TTUxSHAuJXUtNk9eO0NEXixcPj4pW1w0VSJPN01eVmpBM2RocCt0LCtvTVQvcWU7RV9APTxPJ006Pz8lcjpiTGMsZ0YhSCUjQlVmLGFLJEIkJzg3QyZMJGBfWS5sMUYzQ29pOFhGXzM2LW4sSSgkYTBwNGQzRE87TmYrSUpBM3I6XzBqWWpHYEYnNyJAJDxIP0UnXyElWD1fcGZAMyI6NmhZPGo7U01yN0ZUZUxeRDlmNF1MQGEkJmc4bmUsdVRMR0dSUi0hIi8qPjtcQjZQTG0rcUlrb14qYHVPI0pkQVZLUCdRQDxYb142bC4zYDdZIykuLjVlQltOT2IzKllzaStSQyQkZzpfYUNeSk5uRCcnb1UqQCo3QVs/SVJJNyJFaCZjSjwjOSo+USw7T2ZlNiFSa2gwMChhb208VWQtX0hGc3NePzBJUm8nUXNzO15XMSVgVCdXbDY3XmBFPjA8Q2ZBZU1RQTcjTkRoNCVwOXF1LU8mUEo5KjZQUFhbPVB1WEVVSzAnKigtJFRuL1EnXSQpNlVRUVxmLj0iXy1dVmYnI0VuS1dtXycwWmRGbW5aJF00MGpQMkA0QDNuWGNhbFAsM1NNbC84QjVqYV5jWik3J21eOlwkIV0/ciFpNCRbVS47KjJLN3VtJ0I7ZWQ+TUVobFE1L2MsJlc0P1xhRHQxOiw9VDBrKytmPyMqRTgnL3NLSCJoO2xpL01vJk4nMFo4L0RmbSFOIUlTY2pqMEtCXXAhKG10UVVlNz9tJDZdbyduJyZUTFd1Xy1CKD9ETD8+T1VLSHBkQXEsR15UbVo7Sjt1Jzg9WlUsXlVtcE4kXGAmSlI1SG5NP2A2MElmXV9YOiZKWHFuJFJcW2htblhnSmRHQms9L04nYU9RZzxrJExiUmdKJ2kmRllnVUhuaUdAcGJQUXJTXUEtImNQV14jaUhbM2soI2BLLT0nTWEqZylLNixGbmpBU0IiXkslXXVvYilNUSNGNjJwYl1HQC9QLm5LQXQ6LTkuLCY5aFhKSGtSZ0lNUmVUU1BEXz4nIjlLMXNwdGhRUnJdQUBwRTNeJzEhP1xqRFNkXFRCIV9vPHVxTmc9QmlCRWcsQz8wbip0V2gkck5XJUo4SSVhMjdJWWh0OTtAZnNsJnNCaC11XGlCZGlwUEU3XE8wWWIsKl9uYjtwMixFS1FIQEdzIUVkMjB+PmVuZHN0cmVhbQplbmRvYmoKMTQgMCBvYmoKPDwKL0ZpbHRlciBbIC9BU0NJSTg1RGVjb2RlIC9GbGF0ZURlY29kZSBdIC9MZW5ndGggMTE5Mgo+PgpzdHJlYW0KR2IhI1s5NjhpRyZBSUkzbG4oaUw3ZHFhTGIrdSZsRVE9JlNRYkRYODpwPl1tNSVIaypyOzgqMjsnSSNMPGEwYE47J0gySVlgRV5INTptYUxdTkRcQSJpKFdUXWAhWmZqLGNBJ1A9LmBYIic8VihCZ0s4SzpCWj1pL3NPLisySDdVazU7I1BqKjYiP3BUZDZSPSZLV0ExO0EjRSwhT1tRODJbXj1XKFtfYl8zI0pCQSVTSExrIzszNk8zSm5Fa0t1UkRXJzFsW2pVT19KIUxaSkkuYSQzVipsYT5YUGhTW1U9WDQ/VG1nTCUvQV5QOmVfLF1AajhdRjFZITtiYSciO3Q3V1FDRVtFR0F1UHFnJmtJdD9XLz8tQ18qaXNKKW4+bmNTX2I7NzFibS1fOzFPZ21FJkRzK19zW3NXTCNUJWE4MHFjZ0VDPilsbShtJ0BvdT4hIU9Qa18wTTcqVWVZQiZCalNRVGFfYkFIVy1mSnByKGhAIVAqbGtHRGwsWTg7ImNOTUE7aEUtXGVZWlZvczhpXTw9JkYuPHMzMVUtcjcyMUVBbT1XVk0qY148P0BaX2tfP3QpcicyQkhgMGZUaVJTInEqJl0paExARzlnVChTLUNyKHVBPEtIbSNba11iYlJpWDJqZjBmYlhSJ2JsWGJATigzMCVfKVlwIV9fckwiI1Q8RkFGUU46WyVocm06ZlotNWhedU5fMTdNXDFudEpLTFdoQTBiVGBFUUErXiFcMTU8WUZmb0dQWWNaKl81XGNickUmaVNaSiRkbEYkUGpybkNKSD0wXS5QVGNYRygqbWZcNiV1Y3RsdXRUcmhMZmoiLCprWGlkTGtaOyI9WG1pXmlsNSdYOzowPjZfXVMnOCRCXlBuJkQ3KmdfdDU5I2xjY0JjZUxfLnBjVW9DYTgmXShkJFVnSD89VENiOFZqYWROOjshLzguNmZpYTwxMHJxWT8wMCI8N0ZUMEZSVV1FYTxsMnFbUEpBYDxISDU8IiM2Wz8rcSxQdWdIPzEpRjskKypyJzxmWjxUR2YnLTAvRVpGaSpVdERTQzVlJWgpWis+bC8yK0BDVU9yKU9CdGRdOGRwMjtPQDdbLldDaWUyWk5GbGNYck84MWdyRWtAU1I8VzxmTXVGbF43MEFVTVI7Iz5gQ2g9U0FzIUVebyIsai03OFBDUWYxUHMqTiZXLT4vRD1EKUFjTU1gdWBnJzUsV0ckKnVgNTciQ2AjNGgtVVRYKzQkYTthTDtWOik8TDIjUD1kaWVBMlBWTzAyLGVlYTMpIlxeVGBqX1czZlY5PFwyJFsrVjk7cF5aWyZTPTVDUUU5a2lXMzM9PT1mMW87aVc6JyQjRW8jPUcxa2BDNHJtODIndSU1Q0w5Lm8lQjgqam1LMU48Xkk9M3RoZTlKWmIsRCNPYC1fIVU/PHFaYC0qWEQsWGYhKCJOLGFOUUQ0NWtUXXNQYUsrJW90L1hcWzdkV2kvJTRoO1lkWTZQNjYpcjEoPDAtdFtLRl9TPiR0ZHMjK01Ma1wsKVlwcDcyJD9RNTo7JFBOPy5zMT9MTmQkTlcqIyFIMi9tKkspKElpQk9+PmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDE1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDA2MSAwMDAwMCBuIAowMDAwMDAwMTAyIDAwMDAwIG4gCjAwMDAwMDAyMDkgMDAwMDAgbiAKMDAwMDAwMDMyMSAwMDAwMCBuIAowMDAwMDAwNTI2IDAwMDAwIG4gCjAwMDAwMDA3MzEgMDAwMDAgbiAKMDAwMDAwMDkzNiAwMDAwMCBuIAowMDAwMDAxMTQxIDAwMDAwIG4gCjAwMDAwMDEyMTAgMDAwMDAgbiAKMDAwMDAwMTUzNyAwMDAwMCBuIAowMDAwMDAxNjE1IDAwMDAwIG4gCjAwMDAwMDM0ODkgMDAwMDAgbiAKMDAwMDAwNTQ2MCAwMDAwMCBuIAowMDAwMDA2NjQ4IDAwMDAwIG4gCnRyYWlsZXIKPDwKL0lEIApbPGM2N2JmYzRlNDkyYzM2YzE1NTBjZTE2MTQxZjYyODJiPjxjNjdiZmM0ZTQ5MmMzNmMxNTUwY2UxNjE0MWY2MjgyYj5dCiUgUmVwb3J0TGFiIGdlbmVyYXRlZCBQREYgZG9jdW1lbnQgLS0gZGlnZXN0IChvcGVuc291cmNlKQoKL0luZm8gOSAwIFIKL1Jvb3QgOCAwIFIKL1NpemUgMTUKPj4Kc3RhcnR4cmVmCjc5MzIKJSVFT0YK";

  function parseNum(v){
    let s=String(v??'').trim().replace(/\s/g,''); if(!s)return NaN;
    const c=s.lastIndexOf(','),d=s.lastIndexOf('.');
    if(c>=0&&d>=0){const k=Math.max(c,d);s=s.slice(0,k).replace(/[.,]/g,'')+'.'+s.slice(k+1);} else if(c>=0)s=s.replace(',','.');
    return Number(s);
  }
  const r2=(v)=>Number.isFinite(v)?Number(v.toFixed(2)):NaN;
  function seedFromId(id){const s=String(id??'').trim(),last=s.slice(-4);return /^\d+$/.test(last)?Number(last):6380;}
  function frac(seed,k){return ((Math.imul((seed + k*101)>>>0,1664525)+1013904223)>>>0)/4294967295;}
  function pars(seed){
    return {
      b:3.6+frac(seed,1)*1.0,
      choke:35.5+frac(seed,2)*1.0,
      ci:0.0014+frac(seed,3)*0.0005,
      ct:1.5+frac(seed,4)*0.8,
      cw:-(0.55+frac(seed,5)*0.35)
    };
  }
  function demand(price,income,taco,wine,p){
    const q=p.b*(p.choke-price)+p.ci*(income-BASE.income)+p.ct*(taco-BASE.taco)+p.cw*(wine-BASE.wine);
    return Math.max(0,q);
  }
  function visibleQ(price,p){return r2(demand(price,BASE.income,BASE.taco,BASE.wine,p));}
  function visibleSpend(price,p){const pp=r2(price),q=visibleQ(price,p);return r2(pp*q);}
  function midpointPct(a,b){const den=(a+b)/2;return den===0?NaN:r2(((b-a)/den)*100);}
  function pairStats(p0,p1,p){
    const q0=visibleQ(p0,p),q1=visibleQ(p1,p),pctP=midpointPct(p0,p1),pctQ=midpointPct(q0,q1);
    const e=(Number.isFinite(pctP)&&pctP!==0)?r2(pctQ/pctP):NaN;
    return {p0,p1,q0,q1,pctP,pctQ,e,absE:r2(Math.abs(e))};
  }
  function classFromE(e){const a=Math.abs(e);if(Math.abs(a-1)<0.005)return 'Unitària';return a>1?'Elàstica':'Inelàstica';}
  function scenario(seed){
    const p=pars(seed);
    return {
      p,
      a18_20:pairStats(18,20,p),
      a10_12:pairStats(10,12,p),
      a8_10:pairStats(8,10,p),
      a25_23:pairStats(25,23,p),
      a7_5:pairStats(7,5,p),
      spend25:visibleSpend(25,p),spend23:visibleSpend(23,p),
      spend7:visibleSpend(7,p),spend5:visibleSpend(5,p)
    };
  }

  const qdefs=[
    {reset:true,q:"Calcula el canvi percentual del preu dels espaguetis entre 18 € i 20 € amb el mètode del punt mig.",unit:'%',kind:'exact',ans:s=>s.a18_20.pctP},
    {q:"En aquest mateix cas, quin és el canvi percentual de la quantitat demandada quan el preu passa de 18 € a 20 €?",unit:'%',kind:'exact',ans:s=>s.a18_20.pctQ},
    {q:"En aquest mateix cas, quina és l'elasticitat-preu de la demanda entre 18 € i 20 €?",unit:'',kind:'elasticity',ans:s=>s.a18_20.e},
    {q:"En aquest mateix cas, la demanda és elàstica o inelàstica?",unit:'',kind:'select',options:['Elàstica','Inelàstica'],ans:s=>classFromE(s.a18_20.e)},
    {reset:true,q:"Calcula el canvi percentual del preu dels espaguetis entre 10 € i 12 € amb el mètode del punt mig.",unit:'%',kind:'exact',ans:s=>s.a10_12.pctP},
    {q:"En aquest mateix cas, quin és el canvi percentual de la quantitat demandada quan el preu passa de 10 € a 12 €?",unit:'%',kind:'exact',ans:s=>s.a10_12.pctQ},
    {q:"En aquest mateix cas, quina és l'elasticitat-preu de la demanda entre 10 € i 12 €?",unit:'',kind:'elasticity',ans:s=>s.a10_12.e},
    {q:"En aquest mateix cas, la demanda és elàstica o inelàstica?",unit:'',kind:'select',options:['Elàstica','Inelàstica'],ans:s=>classFromE(s.a10_12.e)},
    {reset:true,q:"La demanda és elàstica o inelàstica entre els preus de 8 € i 10 €?",unit:'',kind:'select',options:['Elàstica','Inelàstica'],ans:s=>classFromE(s.a8_10.e)},
    {reset:true,q:"Fixa el preu en 25 €. Quina és la despesa total dels consumidors?",unit:'€/dia',kind:'exact',ans:s=>s.spend25},
    {q:"En aquest mateix cas, baixa el preu a 23 €. Quina és ara la despesa total dels consumidors?",unit:'€/dia',kind:'exact',ans:s=>s.spend23},
    {q:"En aquest mateix cas, quan el preu baixa de 25 € a 23 €, la despesa total augmenta o disminueix?",unit:'',kind:'select',options:['Augmenta','Disminueix'],ans:s=>s.spend23>s.spend25?'Augmenta':'Disminueix'},
    {q:"En aquest mateix cas, quina és l'elasticitat-preu de la demanda entre 25 € i 23 €?",unit:'',kind:'elasticity',ans:s=>s.a25_23.e},
    {q:"En aquest mateix cas, la demanda és elàstica o inelàstica?",unit:'',kind:'select',options:['Elàstica','Inelàstica'],ans:s=>classFromE(s.a25_23.e)},
    {reset:true,q:"Fixa el preu en 7 €. Quina és la despesa total dels consumidors?",unit:'€/dia',kind:'exact',ans:s=>s.spend7},
    {q:"En aquest mateix cas, baixa el preu a 5 €. Quina és ara la despesa total dels consumidors?",unit:'€/dia',kind:'exact',ans:s=>s.spend5},
    {q:"En aquest mateix cas, quan el preu baixa de 7 € a 5 €, la despesa total augmenta o disminueix?",unit:'',kind:'select',options:['Augmenta','Disminueix'],ans:s=>s.spend5>s.spend7?'Augmenta':'Disminueix'},
    {q:"En aquest mateix cas, quina és l'elasticitat-preu de la demanda entre 7 € i 5 €?",unit:'',kind:'elasticity',ans:s=>s.a7_5.e},
    {q:"En aquest mateix cas, la demanda és elàstica o inelàstica?",unit:'',kind:'select',options:['Elàstica','Inelàstica'],ans:s=>classFromE(s.a7_5.e)}
  ];

  function renderQuestions(){
    const host=$('elas-questions-body');host.innerHTML='';
    qdefs.forEach((d,i)=>{
      const row=document.createElement('div');row.className='q-row';
      const n=document.createElement('div');n.className='q-num';n.textContent=String(i+1);
      const t=document.createElement('div');t.className='q-text';
      if(d.reset){const b=document.createElement('strong');b.textContent='Torna als valors inicials. ';t.appendChild(b);}
      t.appendChild(document.createTextNode(d.q));
      const a=document.createElement('div');a.className='q-answer';let c;
      if(d.kind==='select'){
        c=document.createElement('select');const ph=document.createElement('option');ph.value='';ph.textContent='Selecciona';c.appendChild(ph);
        d.options.forEach(o=>{const op=document.createElement('option');op.value=o;op.textContent=o;c.appendChild(op);});
      }else{c=document.createElement('input');c.type='text';c.inputMode='decimal';c.autocomplete='off';}
      c.id=`elas-answer-${i+1}`;c.addEventListener('input',()=>check(i));c.addEventListener('change',()=>check(i));a.appendChild(c);
      const u=document.createElement('div');u.className='q-unit';u.textContent=d.unit;
      const k=document.createElement('div');k.className='q-check blank';k.id=`elas-check-${i+1}`;k.textContent='·';
      row.append(n,t,a,u,k);host.appendChild(row);
    });
  }

  function check(i){
    const d=qdefs[i],c=$(`elas-answer-${i+1}`),box=$(`elas-check-${i+1}`);if(!c||!box)return;
    const raw=c.value;if(raw===''){box.className='q-check blank';box.textContent='·';return;}
    const s=scenario(seedFromId($('elas-student-id').value));let ok=false;
    if(d.kind==='select') ok=raw===d.ans(s);
    else{
      const v=parseNum(raw),expected=d.ans(s);
      if(Number.isFinite(v)&&Number.isFinite(expected)){
        const vv=r2(v),ee=r2(expected);
        if(d.kind==='elasticity') ok=(vv===ee || vv===r2(-ee) || r2(Math.abs(vv))===r2(Math.abs(ee)));
        else ok=vv===ee;
      }
    }
    box.className='q-check '+(ok?'correct':'wrong');box.textContent=ok?'Correcte':'Revisa-ho';
  }

  function readModel(){return {price:parseNum($('elas-price').value),income:parseNum($('elas-income').value),taco:parseNum($('elas-taco').value),wine:parseNum($('elas-wine').value)};}
  function resetModel(){
    $('elas-price').value='18,00';$('elas-income').value='20000';$('elas-taco').value='6,00';$('elas-wine').value='20,00';update();
  }
  function svgEl(name,attrs={}){const el=document.createElementNS('http://www.w3.org/2000/svg',name);Object.entries(attrs).forEach(([k,v])=>el.setAttribute(k,String(v)));return el;}
  function draw(m,p){
    const svg=$('elas-chart');while(svg.firstChild)svg.removeChild(svg.firstChild);
    const box=svg.getBoundingClientRect(),W=Math.max(520,Math.round(box.width||650)),H=Math.max(500,Math.round(box.height||650));svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
    const margin={l:70,r:24,t:22,b:58},pw=W-margin.l-margin.r,ph=H-margin.t-margin.b;
    const interceptShift=p.ci*(m.income-BASE.income)+p.ct*(m.taco-BASE.taco)+p.cw*(m.wine-BASE.wine);
    const effectiveChoke=p.choke+interceptShift/p.b;
    const qIntercept=Math.max(0,p.b*effectiveChoke);
    const pMax=Math.max(40,Math.ceil(effectiveChoke/5)*5),qMax=Math.max(100,Math.ceil(qIntercept/20)*20);
    const X=v=>margin.l+(v/qMax)*pw,Y=v=>margin.t+ph-(v/pMax)*ph;
    const g=svgEl('g');
    for(let i=0;i<=5;i++){const val=pMax*i/5,yy=Y(val);g.appendChild(svgEl('line',{x1:margin.l,y1:yy,x2:W-margin.r,y2:yy,stroke:'#d6d4cf','stroke-width':1,'stroke-dasharray':'2 3'}));const t=svgEl('text',{x:margin.l-9,y:yy+3.5,'text-anchor':'end','font-size':10,fill:'#555b5e'});t.textContent=String(Math.round(val));g.appendChild(t);}
    for(let i=0;i<=5;i++){const val=qMax*i/5,xx=X(val);const t=svgEl('text',{x:xx,y:H-margin.b+18,'text-anchor':'middle','font-size':10,fill:'#555b5e'});t.textContent=fmt2.format(val).replace(',00','');g.appendChild(t);}
    svg.appendChild(g);
    svg.appendChild(svgEl('line',{x1:margin.l,y1:margin.t,x2:margin.l,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));
    svg.appendChild(svgEl('line',{x1:margin.l,y1:H-margin.b,x2:W-margin.r,y2:H-margin.b,stroke:'#4e5356','stroke-width':1.2}));
    const p0=Math.max(0,effectiveChoke),q0=Math.max(0,p.b*effectiveChoke);
    svg.appendChild(svgEl('path',{d:`M ${X(0)} ${Y(p0)} L ${X(q0)} ${Y(0)}`,fill:'none',stroke:'#1f6d95','stroke-width':3,'stroke-linecap':'round'}));
    const q=demand(m.price,m.income,m.taco,m.wine,p);
    if(Number.isFinite(q)&&Number.isFinite(m.price)&&m.price>=0&&m.price<=pMax&&q>=0&&q<=qMax){
      const xx=X(q),yy=Y(m.price),baseY=Y(0),leftX=X(0);
      svg.appendChild(svgEl('rect',{x:leftX,y:yy,width:Math.max(0,xx-leftX),height:Math.max(0,baseY-yy),fill:'rgba(230,184,92,.20)',stroke:'#c8a86b','stroke-width':1}));
      svg.appendChild(svgEl('line',{x1:leftX,y1:yy,x2:xx,y2:yy,stroke:'#8d8880','stroke-width':1.3,'stroke-dasharray':'5 5'}));
      svg.appendChild(svgEl('line',{x1:xx,y1:yy,x2:xx,y2:baseY,stroke:'#8d8880','stroke-width':1.3,'stroke-dasharray':'5 5'}));
      svg.appendChild(svgEl('circle',{cx:xx,cy:yy,r:5,fill:'#e8682b',stroke:'#fff','stroke-width':1.5}));
    }
    const xt=svgEl('text',{x:margin.l+pw/2,y:H-10,'text-anchor':'middle','font-size':11.5,fill:'#353a3d','font-weight':700});xt.textContent='Quantitat demandada (plats/dia)';svg.appendChild(xt);
    const yt=svgEl('text',{x:18,y:margin.t+ph/2,'text-anchor':'middle','font-size':11.5,fill:'#353a3d','font-weight':700,transform:`rotate(-90 18 ${margin.t+ph/2})`});yt.textContent='Preu (€/plat)';svg.appendChild(yt);
  }
  function update(){
    const p=pars(seedFromId($('elas-student-id').value)),m=readModel();
    const q=demand(m.price,m.income,m.taco,m.wine,p),qv=r2(q),pv=r2(m.price),sp=r2(pv*qv);
    $('elas-qd').textContent=Number.isFinite(qv)?fmt2.format(qv):'—';$('elas-spending').textContent=Number.isFinite(sp)?fmt2.format(sp):'—';draw(m,p);
    qdefs.forEach((_,i)=>{const c=$(`elas-answer-${i+1}`);if(c&&c.value!=='')check(i);});
  }
  function openPdf(){
    try{const raw=atob(pdfBase64),bytes=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);const url=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));const w=window.open(url,'_blank','noopener');if(!w){const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener';a.click();}setTimeout(()=>URL.revokeObjectURL(url),60000);}catch(e){alert('No s’ha pogut obrir el PDF.');console.error(e);}
  }

  
  $('elas-reset-model').addEventListener('click',resetModel);
  $('elas-student-id').addEventListener('input',()=>{resetModel();qdefs.forEach((_,i)=>{const c=$(`elas-answer-${i+1}`);if(c&&c.value!=='')check(i);});});
  ['elas-price','elas-income','elas-taco','elas-wine'].forEach(id=>$(id).addEventListener('input',update));
  window.addEventListener('resize',update);
  renderQuestions();resetModel();requestAnimationFrame(update);

})();
