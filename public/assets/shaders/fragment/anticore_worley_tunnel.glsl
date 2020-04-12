const float cylinderRadius=4.;
const float worleyPointDiv=2.;
const float worleySpeed=1.;
const float worleyYMult=1.;
const float worleyXMult=2.5;
const float worleyDiv=9.;
const float cameraSpeed=10.;
const int maxSteps=80;
const float maxDistance=80.;

vec3 permute(vec3 x){
    return mod((34.*x+1.)*x,289.);
}

vec3 dist(vec3 x,vec3 y,vec3 z,bool manhattanDistance){
    return manhattanDistance?abs(x)+abs(y)+abs(z):(x*x+y*y+z*z);
}

vec2 worley(vec3 P,float jitter,bool manhattanDistance){
    float K=.142857142857;// 1/7
    float Ko=.428571428571;// 1/2-K/2
    float K2=.020408163265306;// 1/(7*7)
    float Kz=.166666666667;// 1/6
    float Kzo=.416666666667;// 1/2-1/6*2
    
    vec3 Pi=mod(floor(P),289.);
    vec3 Pf=fract(P)-.5;
    
    vec3 Pfx=Pf.x+vec3(1.,0.,-1.);
    vec3 Pfy=Pf.y+vec3(1.,0.,-1.);
    vec3 Pfz=Pf.z+vec3(1.,0.,-1.);
    
    vec3 p=permute(Pi.x+vec3(-1.,0.,1.));
    vec3 p1=permute(p+Pi.y-1.);
    vec3 p2=permute(p+Pi.y);
    vec3 p3=permute(p+Pi.y+1.);
    
    vec3 p11=permute(p1+Pi.z-1.);
    vec3 p12=permute(p1+Pi.z);
    vec3 p13=permute(p1+Pi.z+1.);
    
    vec3 p21=permute(p2+Pi.z-1.);
    vec3 p22=permute(p2+Pi.z);
    vec3 p23=permute(p2+Pi.z+1.);
    
    vec3 p31=permute(p3+Pi.z-1.);
    vec3 p32=permute(p3+Pi.z);
    vec3 p33=permute(p3+Pi.z+1.);
    
    vec3 ox11=fract(p11*K)-Ko;
    vec3 oy11=mod(floor(p11*K),7.)*K-Ko;
    vec3 oz11=floor(p11*K2)*Kz-Kzo;// p11 < 289 guaranteed
    
    vec3 ox12=fract(p12*K)-Ko;
    vec3 oy12=mod(floor(p12*K),7.)*K-Ko;
    vec3 oz12=floor(p12*K2)*Kz-Kzo;
    
    vec3 ox13=fract(p13*K)-Ko;
    vec3 oy13=mod(floor(p13*K),7.)*K-Ko;
    vec3 oz13=floor(p13*K2)*Kz-Kzo;
    
    vec3 ox21=fract(p21*K)-Ko;
    vec3 oy21=mod(floor(p21*K),7.)*K-Ko;
    vec3 oz21=floor(p21*K2)*Kz-Kzo;
    
    vec3 ox22=fract(p22*K)-Ko;
    vec3 oy22=mod(floor(p22*K),7.)*K-Ko;
    vec3 oz22=floor(p22*K2)*Kz-Kzo;
    
    vec3 ox23=fract(p23*K)-Ko;
    vec3 oy23=mod(floor(p23*K),7.)*K-Ko;
    vec3 oz23=floor(p23*K2)*Kz-Kzo;
    
    vec3 ox31=fract(p31*K)-Ko;
    vec3 oy31=mod(floor(p31*K),7.)*K-Ko;
    vec3 oz31=floor(p31*K2)*Kz-Kzo;
    
    vec3 ox32=fract(p32*K)-Ko;
    vec3 oy32=mod(floor(p32*K),7.)*K-Ko;
    vec3 oz32=floor(p32*K2)*Kz-Kzo;
    
    vec3 ox33=fract(p33*K)-Ko;
    vec3 oy33=mod(floor(p33*K),7.)*K-Ko;
    vec3 oz33=floor(p33*K2)*Kz-Kzo;
    
    vec3 dx11=Pfx+jitter*ox11;
    vec3 dy11=Pfy.x+jitter*oy11;
    vec3 dz11=Pfz.x+jitter*oz11;
    
    vec3 dx12=Pfx+jitter*ox12;
    vec3 dy12=Pfy.x+jitter*oy12;
    vec3 dz12=Pfz.y+jitter*oz12;
    
    vec3 dx13=Pfx+jitter*ox13;
    vec3 dy13=Pfy.x+jitter*oy13;
    vec3 dz13=Pfz.z+jitter*oz13;
    
    vec3 dx21=Pfx+jitter*ox21;
    vec3 dy21=Pfy.y+jitter*oy21;
    vec3 dz21=Pfz.x+jitter*oz21;
    
    vec3 dx22=Pfx+jitter*ox22;
    vec3 dy22=Pfy.y+jitter*oy22;
    vec3 dz22=Pfz.y+jitter*oz22;
    
    vec3 dx23=Pfx+jitter*ox23;
    vec3 dy23=Pfy.y+jitter*oy23;
    vec3 dz23=Pfz.z+jitter*oz23;
    
    vec3 dx31=Pfx+jitter*ox31;
    vec3 dy31=Pfy.z+jitter*oy31;
    vec3 dz31=Pfz.x+jitter*oz31;
    
    vec3 dx32=Pfx+jitter*ox32;
    vec3 dy32=Pfy.z+jitter*oy32;
    vec3 dz32=Pfz.y+jitter*oz32;
    
    vec3 dx33=Pfx+jitter*ox33;
    vec3 dy33=Pfy.z+jitter*oy33;
    vec3 dz33=Pfz.z+jitter*oz33;
    
    vec3 d11=dist(dx11,dy11,dz11,manhattanDistance);
    vec3 d12=dist(dx12,dy12,dz12,manhattanDistance);
    vec3 d13=dist(dx13,dy13,dz13,manhattanDistance);
    vec3 d21=dist(dx21,dy21,dz21,manhattanDistance);
    vec3 d22=dist(dx22,dy22,dz22,manhattanDistance);
    vec3 d23=dist(dx23,dy23,dz23,manhattanDistance);
    vec3 d31=dist(dx31,dy31,dz31,manhattanDistance);
    vec3 d32=dist(dx32,dy32,dz32,manhattanDistance);
    vec3 d33=dist(dx33,dy33,dz33,manhattanDistance);
    
    vec3 d1a=min(d11,d12);
    d12=max(d11,d12);
    d11=min(d1a,d13);// Smallest now not in d12 or d13
    d13=max(d1a,d13);
    d12=min(d12,d13);// 2nd smallest now not in d13
    vec3 d2a=min(d21,d22);
    d22=max(d21,d22);
    d21=min(d2a,d23);// Smallest now not in d22 or d23
    d23=max(d2a,d23);
    d22=min(d22,d23);// 2nd smallest now not in d23
    vec3 d3a=min(d31,d32);
    d32=max(d31,d32);
    d31=min(d3a,d33);// Smallest now not in d32 or d33
    d33=max(d3a,d33);
    d32=min(d32,d33);// 2nd smallest now not in d33
    vec3 da=min(d11,d21);
    d21=max(d11,d21);
    d11=min(da,d31);// Smallest now in d11
    d31=max(da,d31);// 2nd smallest now not in d31
    d11.xy=(d11.x<d11.y)?d11.xy:d11.yx;
    d11.xz=(d11.x<d11.z)?d11.xz:d11.zx;// d11.x now smallest
    d12=min(d12,d21);// 2nd smallest now not in d21
    d12=min(d12,d22);// nor in d22
    d12=min(d12,d31);// nor in d31
    d12=min(d12,d32);// nor in d32
    d11.yz=min(d11.yz,d12.xy);// nor in d12.yz
    d11.y=min(d11.y,d12.z);// Only two more to go
    d11.y=min(d11.y,d11.z);// Done! (Phew!)
    return sqrt(d11.xy);// F1, F2
}

float sdCylinder(vec3 point,vec3 c){
    return length(point.xz-c.xy)-c.z;
}

vec3 diffuseLight(vec3 lightPosition,vec3 lightColor,vec3 point,vec3 normal){
    vec3 lightDirection=normalize(lightPosition-point);
    float diff=max(dot(normal,lightDirection),.01);
    return lightColor*diff;
}

mat3 rotX(float angle){
    return mat3(
        vec3(1.,0.,0.),
        vec3(0.,cos(angle),-sin(angle)),
        vec3(0.,sin(angle),cos(angle))
    );
}

const float PRECISION=.1;

float cylinderMap(vec3 point){
    point*=rotX(1.57);
    vec2 w=worley(vec3(point.xy/worleyPointDiv,point.z+iTime*worleySpeed),1.,false);
    float disp=(w.y*worleyYMult+w.x*worleyXMult)/worleyDiv;
    return abs(sdCylinder(point,vec3(0.,0.,cylinderRadius))-disp);
}

vec3 moveCamera(vec3 point){
    return vec3(point.xy,point.z-iTime*cameraSpeed);
}

float map(vec3 point){
    vec3 camera=moveCamera(point);
    return cylinderMap(camera);
}

float raymarch(vec3 rayOrigin,vec3 rayDirection){
    float stepSize,totalDistance=1.;
    
    for(int i=0;i<80;i++){
        vec3 p=rayOrigin+rayDirection*totalDistance;
        stepSize=map(p);
        
        totalDistance+=stepSize;
        
        if(totalDistance>80.){
            return-1.;
        }
        
        if(stepSize<PRECISION){
            return totalDistance;
        }
    }
    
    return-1.;
}

vec3 calculateSurface(vec3 point){
    return vec3(1.,1.,1.);
}

vec3 calculateLighting(vec3 point,vec3 normal,float dist){
    return diffuseLight(
        vec3(-1.+sin(iTime),-1.+cos(iTime),-12.),
        vec3(.5,.3,.7),
    point,normal)*.8
    
    +diffuseLight(
        vec3(2.-cos(iTime),2.-sin(iTime),-30.+sin(iTime/2.)),
        vec3(.7,.3,.5),
    point,normal)*.5
    
    +diffuseLight(
        vec3(3.,-2.+sin(iTime)/3.,-42.+cos(iTime)),
        vec3(.7,.5,.6),
    point,normal)*.5
    
    +diffuseLight(
        vec3(-4.+cos(iTime*4.)/3.,-4.+cos(iTime*4.),-60.),
        vec3(.8,.7,.8),
    point,normal)*.55
    
    +diffuseLight(
        vec3(4.,14.+cos(iTime*4.),-90.-cos(iTime*4.)),
        vec3(.4,.5,.8),
    point,normal)*.55
    
    +diffuseLight(
        vec3(-5.,-14.+sin(iTime*7.),-95.-sin(iTime*3.)),
        vec3(.6,.5,.7),
    point,normal)*.55
    
    +diffuseLight(
        vec3(-0.,-0.,-140.+sin(iTime/2.)),
        vec3(.5,.5,1.),
    point,normal)*.2+clamp(sin(iTime*2.),0.,1.)/20.;
}

vec3 estimateNormal(vec3 p){
    float EPSILON=.0005;
    
    return normalize(vec3(
            map(vec3(p.x+EPSILON,p.y,p.z))-map(vec3(p.x-EPSILON,p.y,p.z)),
            map(vec3(p.x,p.y+EPSILON,p.z))-map(vec3(p.x,p.y-EPSILON,p.z)),
            map(vec3(p.x,p.y,p.z+EPSILON))-map(vec3(p.x,p.y,p.z-EPSILON))
        ));
    }
    
    vec4 background(in vec2 fragCoord){
        vec2 vUv=fragCoord/iResolution.xy;
        vec2 q=(vUv.xy*iResolution.xy-.5*iResolution.xy)/iResolution.y;
        return vec4(vec3(vec3(.7,.3,.7)-length(q*10.)),1.);
    }
    
    vec4 mainColor(vec3 surface,vec3 lighting,float dist,vec2 fragCoord){
        if(dist==-1.)return background(fragCoord);
        return vec4(surface*lighting,1.);
    }
    
    void mainImage(out vec4 fragColor,in vec2 fragCoord){
        vec3 rayOrigin=vec3(0.,0.,2.);
        // vec2 vUv=fragCoord/iResolution.xy;
        // vec2 q=(vUv.xy*iResolution.xy-.5*iResolution.xy)/iResolution.y;
        vec3 rayDirection=normalize(vec3(vPosition-0.5,0.)-rayOrigin);
        
        float dist=raymarch(rayOrigin,rayDirection);
        vec3 point=rayOrigin+dist*rayDirection;
        vec3 normal=estimateNormal(point);
        
        vec3 surface=calculateSurface(point);
        
        vec3 lighting=calculateLighting(point,normal,dist);
        
        fragColor=mainColor(surface,lighting,dist,fragCoord);

        
    }