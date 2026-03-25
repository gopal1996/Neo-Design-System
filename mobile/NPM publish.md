Build                                                                                                     
                                                                                                            
  cd mobile                                                                                                 
  npm run build                                                                                             
                                                                                                          
  This runs tsup and outputs to dist/:                                                                      
  - dist/index.js — ESM
  - dist/index.cjs — CommonJS                                                                               
  - dist/index.d.ts — TypeScript declarations                                                             
  - dist/*.js.map — source maps              
                                                                                                            
  Verify the output before publishing
                                                                                                            
  # Check what will actually be published                                                                 
  npm pack --dry-run                                                                                        
                                                                                                            
  The files field in package.json controls what ships:
  dist/          ← built output                                                                             
  src/tokens/    ← raw tokens (for RN consumers using react-native field)                                   
  src/components/                                                        
  src/index.ts                                                                                              
                                                                                                          
  ---                                                                                                       
  Publish to npm                                                                                            
                
  First time (login)                                                                                        
                                                                                                            
  npm login
  # or for a specific registry:                                                                             
  npm login --registry https://registry.npmjs.org                                                         

  Bump the version first                                                                                    
   
  # Pick one:                                                                                               
  npm version patch   # 1.0.0 → 1.0.1  (bug fixes)                                                        
  npm version minor   # 1.0.0 → 1.1.0  (new components)                                                     
  npm version major   # 1.0.0 → 2.0.0  (breaking changes)
                                                                                                            
  Publish                                                                                                 
                                                                                                            
  # Public scoped package (@neo-design-library/mobile)                                                    
  npm publish --access public  