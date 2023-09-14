import { Component } from '@angular/core';
import * as XLSX from 'xlsx';  // Convierte excel a objeto
import { GeolocalizacionService } from './geolocalizacion.service';
 
interface array2 {
ID:number,
idCliente:number,
nombre:string,
precio:number,
codigoBarras:string,
stockMinimo: number,
idProduc: string

} 

interface array {
  Cod_Usuario:number,
  Usuario:number,
  Pais:string,
  Cod_Pais:number,
  nombre:string,
  Cod_Provincia:number,
  Provincia:string,
  Cod_Canton:number,
  Canton:string,
  Cod_Distrito:number,
  Distrito:string,
  }
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
    convertedJson!:string;

    array:array [] =[]
  constructor(
 public geolocalizacionService: GeolocalizacionService   
  ) {}

  // INSTALAR npm install xlsx --save para trabajr excel como un objeto Provincia de Cartago

 async  fileUpload(event){
  let listaEstados = [];
  let retornarData = [];
  let contador = 0;
    this.geolocalizacionService.Country_Code = "CR";
    this.geolocalizacionService.getStates().toPromise().then( (states:any[])=>{
      console.log('states', states)
      if(states.length == 0){
  
      }

      
      states.forEach( (state, index) =>{
        let nombre = null;
        let va = this.removerCaracteresEspeciales(state.name).split(' Province')[0] ;
        switch(va){
          case  'Provincia de Cartago':
            nombre = 'Cartago';
          break;
          default:
            nombre = va;
          break;
        }
        let data = {
          id: state.iso2,
          valor:   nombre
        }
        listaEstados.push(data)
  if(index == states.length -1){
    console.log(event.target.files)
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) =>{
      console.log(event);
      let binaryData = event.target.result;
      console.log(binaryData, 'binaryData');  
      //  EL METODO READ TIENE DOS PARAMETROS 1 EL BINARY DATA Y EL TIPO
      let workbook = XLSX.read(binaryData, {type:'binary'});
      workbook.SheetNames.forEach(async (sheet) =>{
const data:any = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
let ciudades = [];
console.log(listaEstados,'listaEstados')
this.array = data;
console.log(this.array,'this.array')
this.array.forEach(async(item,index2) =>{
 console.log(item,'item', index2);
 
let estado = listaEstados.findIndex( (estado) => estado.valor == item.Provincia);
let Cod_Estado,Estado = null;
if(estado<0)   contador +=1;
if(estado >=0){
  Cod_Estado = listaEstados[estado].id;
  Estado = listaEstados[estado].valor;
  this.geolocalizacionService.State_Code = Cod_Estado;
 
  this.geolocalizacionService.getCities().toPromise().then( (cities:any[])=>{
  console.log('cities', cities)
  let geolocalizacion ={
    Cod_Usuario : item.Cod_Usuario,
    Codigo_Pais: item.Cod_Pais,
    Pais : this.removerCaracteresEspeciales(item.Pais),
    Codigo_Estado : Cod_Estado,
    Estado: Estado,
    Codigo_Ciudad: 0,
    Ciudad: item.Distrito,
    Codigo_Postal: null,
    Direccion: null
  }
  console.log(cities.length == 0,'cities.length == 0')

  
    cities.forEach( (city, index) =>{
      let data = {
        id: city.id,
        valor:this.removerCaracteresEspeciales(city.name).split(' Province')[0]
      }
     let indexCiudad = ciudades.findIndex( (ciudad) => ciudad.valor == data.valor);
     if(indexCiudad < 0)  ciudades.push(data)
  
   
    console.log('indexCiudad',indexCiudad)
  let indexRetornoDate = retornarData.findIndex( (retorno) => retorno.Cod_Usuario == geolocalizacion.Cod_Usuario);
  if(indexRetornoDate < 0)  {
 
    retornarData.push(geolocalizacion)
  }   
  console.log(geolocalizacion,'geolocalizacion')
  console.log(contador,'contador')
if(index == cities.length -1){
  contador +=1;
if(contador == this.array.length){
//  console.log(ciudades,'ciudades')
// console.log(retornarData,'retornarData')
  retornarData.forEach( (retorno, index) =>{
    let ciudadesL = ciudades.findIndex( (ciudad) => ciudad.valor == retorno.Ciudad);
    let Cod_Ciudad,Ciudad = null;
    if(ciudadesL >=0){
      Cod_Ciudad = ciudades[ciudadesL].id;
      Ciudad = ciudades[ciudadesL].valor; 
    }
    retorno.Codigo_Ciudad = Cod_Ciudad  == undefined  ? null : Cod_Ciudad;
    retorno.Ciudad = Ciudad;
  
   if( retornarData.length -1 == index){
    console.log(retornarData,'retornarData')
   
   }
   })

}
 
 
 

//  console.log(geolocalizacion,'geolocalizacion')
}

    })
  })



}
 
 
 
})
//console.log(this.array, 'data')


 
//this.convertedJson = JSON.stringify(data, undefined, 4);
      });
      console.log(workbook)

    }
  }
  
      })
    })
 
  }

  removerCaracteresEspeciales(str:string){
   return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }
}
