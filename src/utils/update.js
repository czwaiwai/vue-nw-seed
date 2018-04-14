'use strict'

import { App } from 'nw.gui'
import fs from 'fs'
import path from 'path'
import http from 'http'
import qs from 'qs'
const events = require('events')

const { manifest } = App
// const platform = (/^win/.test(process.platform) ? 'win' : /^darwin/.test(process.platform) ? 'osx' : 'linux') + (process.arch === 'ia32' ? '32' : '64')
const platform = 'win32'
const options = { method: 'GET', mode: 'cors', credentials: 'include' }
let tmpUpdateJson = null

// get update.json
export function getUpdateJson (noCache, paramObj) {
  // if (!noCache && tmpUpdateJson) return new Promise((resolve, reject) => resolve(tmpUpdateJson))
  if (!noCache && tmpUpdateJson) return Promise.resolve(tmpUpdateJson)
  let params = '&' + qs.stringify(paramObj)
  return window.fetch(manifest.manifestUrl + '?' + new Date().getTime() + params, options)
    .then(resp => resp.json())
    .then(json => {
      tmpUpdateJson = json
      return tmpUpdateJson
    })
}

export function parseName (json, isOnlyWin32) {
  if (!json) return
  let pkg = json.packages[platform]
  if (isOnlyWin32) {
    pkg = json.packages['win32']
  }
  if (!pkg) return
  return path.parse(pkg.url).base
}

// check version
export function checkUpdate (params) {
  getUpdateJson(null, params).then(json => {
    if (json.version === App.manifest.version) return
    window.location.hash = '/update'
  })
}
export function hotDownload (savePath, json) {
  const ev = new events.EventEmitter()

  const uri = json.hotUrl
  const totalSize = json.hotSize
  const loadFile = fs.createWriteStream(savePath)
  let loaded = 0
  console.log(uri, savePath, totalSize)
  http
    .get(uri, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) return ev.emit('error', res.statusCode)
      res.on('end', () => {
        loadFile.end()
        loadFile.destroySoon()
        ev.emit('end', savePath)
      })
      res.on('error', err => ev.emit('error', err.message))
      res.on('data', chunk => {
        console.log(chunk, '怎么肥事')
        loadFile.write(chunk)
        loaded += chunk.length
        ev.emit('data', loaded / totalSize)
      })
    })
    .on('error', err => ev.emit('error', err.message))

  return ev
}
export function downloadHandle (savePath, json) {
  const ev = new events.EventEmitter()

  const uri = json.packages[platform].url
  const totalSize = json.packages[platform].size
  const loadFile = fs.createWriteStream(savePath)
  let loaded = 0
  console.log(uri, savePath, totalSize)
  http
    .get(uri, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) return ev.emit('error', res.statusCode)
      res.on('end', () => {
        loadFile.end()
        loadFile.destroySoon()
        ev.emit('end', savePath)
      })
      res.on('error', err => ev.emit('error', err.message))
      res.on('data', chunk => {
        loadFile.write(chunk)
        loaded += chunk.length
        ev.emit('data', loaded / totalSize)
      })
    })
    .on('error', err => ev.emit('error', err.message))

  return ev
}
