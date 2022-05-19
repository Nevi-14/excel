import { Component } from '@angular/core';
import * as XLSX from 'xlsx';  // Convierte excel a objeto
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
    convertedJson!:string;
  constructor() {}

  // INSTALAR npm install xlsx --save para trabajr excel como un objeto

  fileUpload(event){
    console.log(event.target.files)
    const selectedFile = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(selectedFile);
    fileReader.onload = (event) =>{
      console.log(event);
      let binaryData = event.target.result;
      //  EL METODO READ TIENE DOS PARAMETROS 1 EL BINARY DATA Y EL TIPO
      let workbook = XLSX.read(binaryData, {type:'binary'});
      workbook.SheetNames.forEach(sheet =>{
const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
console.log(data)
this.convertedJson = JSON.stringify(data, undefined, 4);
      });
      console.log(workbook)

    }
  }
}
