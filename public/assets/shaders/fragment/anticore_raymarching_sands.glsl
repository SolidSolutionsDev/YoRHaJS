vec3 rgb2colorvector ( float r, float g, float b, float a ) {
    return normalize(vec3( r,   g,  b)) * a;
}

vec3 ambientLight() {
    float ambientLightStrength = 0.1;
    vec3 lightColor = rgb2colorvector(250., 220., 180., 1.);

    return lightColor * ambientLightStrength;
}


vec3 directionalLight(vec3 lightDirection, vec3 lightColor, vec3 point, vec3 normal) {
    float diff = max(dot(normal, normalize(lightDirection)), 0.01);
    return lightColor * diff;
}


vec3 diffuseLight(vec3 lightPosition, vec3 lightColor, vec3 point, vec3 normal) {
    vec3 lightDirection = normalize(lightPosition - point);
    float diff = max(dot(normal, lightDirection), 0.1);
    return lightColor * diff;
}

vec3 applyFog( in vec3  rgb,
in float distance)
{
    float fogAmount = 1.0 - exp( -distance * 0.03) * 1.;
    vec3  fogColor  = vec3(.0, .2, .6);
    return mix( rgb, fogColor, fogAmount );
}


vec3 sandLight(vec3 intersectionPoint, vec3 intersectionPointNormal) {
    return ambientLight()
    + diffuseLight(vec3(4., 4., -15.), vec3(1., .3, 5.), intersectionPoint, intersectionPointNormal)
    + diffuseLight(vec3(-6., 0., -13.), vec3(0.3, 0.3, 0.6), intersectionPoint, intersectionPointNormal);
}

float oneDrandom (float f) {
    return fract(sin(dot(vec2(f, f),
    vec2(12.9898,78.233)))*
    43758.5453123);
}

float oneDnoise (float x) {
    float i = floor(x);
    float f = fract(x);

    return mix(oneDrandom(i), oneDrandom(i + 1.), smoothstep(0., 1., f));
}

float twoDrandom (in vec2 st) {
    return fract(cos(dot(st.xy,
    vec2(12.9898,78.233)))
    * 43758.5453123);
}

float twoDnoise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = twoDrandom(i);
    float b = twoDrandom(i + vec2(1.0, 0.0));
    float c = twoDrandom(i + vec2(0.0, 1.0));
    float d = twoDrandom(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) +
    (c - a)* u.y * (1.0 - u.x) +
    (d - b) * u.x * u.y;
}

float sdfPlane ( vec3 point, vec4 normal ) {
    return dot(point, normal.xyz) + normal.w;
}


float sandDistanceMap ( vec3 point ) {
    float distance = min(sdfPlane(point, vec4(0, -1, 0, 3))
    + 1.1 *  twoDnoise(vec2(point.x, point.z - iTime)), sdfPlane(point, vec4(0, 2, 0, 3))
    +  1.2 * twoDnoise(vec2(point.x, point.z - iTime)));

    return distance;
}

vec3 sandEstimateNormal(vec3 p) {
    float EPSILON = 0.00005;

    return normalize(vec3(
    sandDistanceMap(vec3(p.x + EPSILON, p.y, p.z)) - sandDistanceMap(vec3(p.x - EPSILON, p.y, p.z)),
    sandDistanceMap(vec3(p.x, p.y + EPSILON, p.z)) - sandDistanceMap(vec3(p.x, p.y - EPSILON, p.z)),
    sandDistanceMap(vec3(p.x, p.y, p.z  + EPSILON)) - sandDistanceMap(vec3(p.x, p.y, p.z - EPSILON))
    ));
}

vec3 sandTrace ( vec3 rayOrigin, vec3 rayDirection ) {
    float stepSize, totalDistance = 1.;
    const float maxSteps = 102.;

    for (float i = 0.; i < maxSteps; i++) {
        stepSize = sandDistanceMap(rayOrigin + rayDirection * totalDistance);
        totalDistance += stepSize;
        if (stepSize < 0.01) {
            vec3 intersectionPoint = rayOrigin + rayDirection * totalDistance;
            vec3 intersectionPointNormal = sandEstimateNormal(intersectionPoint);
            vec3 col = ambientLight() + sandLight(intersectionPoint, intersectionPointNormal);
            return applyFog(col, totalDistance);
        }
    }

    return applyFog(ambientLight(), totalDistance);
}


vec3 trace( vec3 rayOrigin, vec3 rayDirection ) {
    return sandTrace(rayOrigin, rayDirection);
}


void mainImage ( out vec4 fragColor, in vec2 fragCoord ) {
//    vec2 uv = fragCoord/iResolution.xy;
//    vec3 rayOrigin = vec3(0., 0., 1.);
//    vec2 q = (fragCoord.xy - .5 * iResolution.xy) / iResolution.y;
//    vec3 rayDirection = normalize(vec3(q, 0.) - rayOrigin);
//    fragColor = vec4(trace(rayOrigin, rayDirection), 1.0);

    vec2 vUv = normalize(vPosition);
    vec3 rayOrigin = vec3(0.5, 0.5, 1.);
    vec3 rayDirection = normalize(vec3(vPosition, 0.) - rayOrigin);
    fragColor = vec4(trace(rayOrigin, rayDirection), 1.0);
}