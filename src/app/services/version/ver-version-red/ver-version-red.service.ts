import {Injectable} from '@angular/core';
import {Version} from '../version.model';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { AutenticacionService } from '../../autenticacion/autenticacion.service';
import {Observable, of} from 'rxjs';
import {Recurso} from './recurso.model';
import { Dropbox } from 'dropbox';
import fetch from 'isomorphic-fetch';

@Injectable({
  providedIn: 'root'
})
export class VerVersionRedService {

  constructor(private http: HttpClient, private autenticacionService: AutenticacionService) {
  }

  getVersion(idVersion: number): Promise<Version> {
    const tokenSisred = this.autenticacionService.obtenerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + tokenSisred
    });
    const urlVersion = environment.apiUrl + 'versiones/{id}/';
    const apiUrl = urlVersion.replace('{id}', idVersion.toString());
    return new Promise((resolve,reject) => {
      this.http.get<any>(apiUrl, {headers}).subscribe(dataItem => {
        let vVersion: Version = new Version();
        vVersion.numero = dataItem.numero;
        vVersion.fechaCreacion = dataItem.fecha_creacion;
        vVersion.creadoPor = dataItem.creado_por.usuario.username;
        vVersion.imagen = dataItem.imagen;
        vVersion.url = '';
        vVersion.nombreRed = dataItem.red.nombre;
        vVersion.nombreConectate = dataItem.red.proyecto_conectate.nombre;
        vVersion.archivos = dataItem.archivos;
        resolve(vVersion);
      }, err => {
        reject(err);
      });
    });
    
  }

  getRecursosVersion(idVersion: number): Promise<Array<Recurso>> {
    const tokenSisred = this.autenticacionService.obtenerToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Token ' + tokenSisred
    });
    const urlVersion = environment.apiUrl + 'versiones/{id}/recursos/';
    const apiUrl = urlVersion.replace('{id}', idVersion.toString());
    let vLstRecurso: Array<Recurso> = [];
    return new Promise((resolve, reject) => {
      this.http.get<any>(apiUrl, {headers}).subscribe(dataItem => {
        dataItem.context.forEach(item => {
          const vObjeto = new Recurso();
          vObjeto.nombre = item.nombre;
          vObjeto.fechaCreacion = item.fecha_creacion;
          vObjeto.tipo = item.tipo;
          vObjeto.thumbnail = item.thumbnail;
          vObjeto.descripcion = item.descripcion;
          vObjeto.archivo = item.archivo;
          vObjeto.id = item.id;
          vLstRecurso.push(vObjeto);
        });
        resolve(vLstRecurso)
      }, err => {
        reject(err);
      });
    });
  }

  getImagenVersion(ruta: string): Promise<any> {
    let ACCESS_TOKEN = 'FOsYIGqxyoAAAAAAAAAACo5sRYD5XCAOZy15c341h99QLcgRWBeiWQfRgnCOt0Gq';
    let dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch });
    
    return dbx.filesGetTemporaryLink({path: ruta});
  }

  descargarZip(ruta: string): Promise<any> {
    let ACCESS_TOKEN = 'FOsYIGqxyoAAAAAAAAAACo5sRYD5XCAOZy15c341h99QLcgRWBeiWQfRgnCOt0Gq';
    let dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch });
    return dbx.filesDownloadZip({path: ruta});
  }

  descargarArchivo(ruta: string): Promise<any> {
    let ACCESS_TOKEN = 'FOsYIGqxyoAAAAAAAAAACo5sRYD5XCAOZy15c341h99QLcgRWBeiWQfRgnCOt0Gq';
    let dbx = new Dropbox({ accessToken: ACCESS_TOKEN, fetch });
    return dbx.filesDownload({path: ruta});
  }
}
