import { APP_BASE_HREF } from '@angular/common'
// import { retry } from 'rxjs/operators'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Inject, Injectable } from '@angular/core'
/* tslint:disable */
import _ from 'lodash'
import { map } from 'rxjs/operators'
import { Observable, Subscription } from 'rxjs'
import { Router } from '@angular/router'
import { MatSnackBar } from '@angular/material/snack-bar'


@Injectable({
  providedIn: 'root',
})
export class InitService {

  baseUrl: string
  configDetails: any

  constructor(
    private http: HttpClient,
    public router: Router,
    public snackBar: MatSnackBar
  ) {

  }

  async init() {
    await this.setConfiDetails()
  }

  private async setConfiDetails(configDetails: any = null): Promise<any> {
    console.log('configDetails', configDetails)
    let loginData = JSON.parse(localStorage.getItem("loginData"))
    if(!loginData || !loginData['access_token']) {
      this.router.navigate(['/']);
        // setTimeout(() => {
        //   this.router.navigate(['/']);
        // }, 500)
        // this.snackBar.open('Your Sessiom Expired , Please login again', 'X', {
        //   duration: 3000,
        //   panelClass: ['snackbar-error']
        // });
    }
    if (configDetails) {
      this.configDetails = configDetails
      this.baseUrl = configDetails.portalURL
    } else {
      try {

        if (this.configDetails) {
          return this.configDetails
        }
        const response = await this.http.get<any>('assets/jsonfiles/configurations.json').toPromise()
        if (response) {
          this.configDetails = response
          this.baseUrl = response.portalURL
        }
      } 
      catch(e) {
        throw new Error('could not fetch configurations')
      }
    }
  }
}
