#!/bin/sh

npm install        
npm run lint       
npm run type-check 
npm run es5        
npm run format
npm test           
