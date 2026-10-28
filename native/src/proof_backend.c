/* Windows uses only the already linked OS cryptographic provider. */
#include <stdint.h>
#include <stddef.h>
#include <string.h>
#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <bcrypt.h>
#include "proof_keys.h"
void halls_proof_time(unsigned char* out){
    FILETIME now; TIME_ZONE_INFORMATION zone;
    GetSystemTimeAsFileTime(&now);
    uint64_t seconds=(((uint64_t)now.dwHighDateTime<<32)|now.dwLowDateTime)/10000000-11644473600ULL;
    DWORD mode=GetTimeZoneInformation(&zone);
    int32_t offset=mode==TIME_ZONE_ID_INVALID?2147483647:-(zone.Bias+(mode==TIME_ZONE_ID_DAYLIGHT?zone.DaylightBias:mode==TIME_ZONE_ID_STANDARD?zone.StandardBias:0));
    memcpy(out,&seconds,8);memcpy(out+8,&offset,4);
}
static int open_alg(BCRYPT_ALG_HANDLE* h,LPCWSTR name){return BCryptOpenAlgorithmProvider(h,name,0,0)>=0;}
int halls_proof_sign(const unsigned char* data,uint32_t size,unsigned char* signature){
    BCRYPT_ALG_HANDLE hash=0,ec=0;BCRYPT_KEY_HANDLE key=0;unsigned char digest[32];ULONG got=0;int ok=0;
    if(!open_alg(&hash,BCRYPT_SHA256_ALGORITHM)||!open_alg(&ec,BCRYPT_ECDSA_P256_ALGORITHM))goto done;
    if(BCryptHash(hash,0,0,(PUCHAR)data,size,digest,32)<0)goto done;
    if(BCryptImportKeyPair(ec,0,BCRYPT_ECCPRIVATE_BLOB,&key,(PUCHAR)proof_signing_key,sizeof(proof_signing_key),0)<0)goto done;
    ok=BCryptSignHash(key,0,digest,32,signature,64,&got,0)>=0 && got==64;
 done:
    if(key)BCryptDestroyKey(key);if(ec)BCryptCloseAlgorithmProvider(ec,0);if(hash)BCryptCloseAlgorithmProvider(hash,0);
    return ok?0:-1;
}
int halls_proof_seal(const unsigned char* data,uint32_t size,uint32_t plain_size,unsigned char* out){
    BCRYPT_ALG_HANDLE rsa=0,aes=0;BCRYPT_KEY_HANDLE pub=0,key=0;unsigned char secret[32];ULONG got=0;int ok=0;
    BCRYPT_OAEP_PADDING_INFO oaep={BCRYPT_SHA256_ALGORITHM,0,0};
    BCRYPT_AUTHENTICATED_CIPHER_MODE_INFO auth;BCRYPT_INIT_AUTH_MODE_INFO(auth);
    memcpy(out,"HLPF\1\r\n\32",8);memcpy(out+8,proof_key_id,8);memcpy(out+28,&plain_size,4);memcpy(out+32,&size,4);
    if(BCryptGenRandom(0,secret,32,BCRYPT_USE_SYSTEM_PREFERRED_RNG)<0 || BCryptGenRandom(0,out+16,12,BCRYPT_USE_SYSTEM_PREFERRED_RNG)<0)goto done;
    if(!open_alg(&rsa,BCRYPT_RSA_ALGORITHM)||!open_alg(&aes,BCRYPT_AES_ALGORITHM))goto done;
    if(BCryptImportKeyPair(rsa,0,BCRYPT_RSAPUBLIC_BLOB,&pub,(PUCHAR)proof_recipient_key,sizeof(proof_recipient_key),0)<0)goto done;
    if(BCryptEncrypt(pub,secret,32,&oaep,0,0,out+36,256,&got,BCRYPT_PAD_OAEP)<0 || got!=256)goto done;
    if(BCryptSetProperty(aes,BCRYPT_CHAINING_MODE,(PUCHAR)BCRYPT_CHAIN_MODE_GCM,sizeof(BCRYPT_CHAIN_MODE_GCM),0)<0)goto done;
    if(BCryptGenerateSymmetricKey(aes,&key,0,0,secret,32,0)<0)goto done;
    auth.pbNonce=out+16;auth.cbNonce=12;auth.pbAuthData=out;auth.cbAuthData=292;auth.pbTag=out+292;auth.cbTag=16;
    ok=BCryptEncrypt(key,(PUCHAR)data,size,&auth,0,0,out+308,size,&got,0)>=0 && got==size;
 done:
    SecureZeroMemory(secret,sizeof(secret));
    if(key)BCryptDestroyKey(key);if(pub)BCryptDestroyKey(pub);if(aes)BCryptCloseAlgorithmProvider(aes,0);if(rsa)BCryptCloseAlgorithmProvider(rsa,0);
    return ok?0:-1;
}
int halls_proof_write(const unsigned char* name,const unsigned char* data,uint32_t size){
    WCHAR path[1024];DWORD n=GetModuleFileNameW(0,path,1024),wrote=0;int result=0;HANDLE file;
    if(!n||n>=1024)return -3;
    while(n && path[n-1]!=L'\\' && path[n-1]!=L'/')--n;
    if(!n || !MultiByteToWideChar(CP_UTF8,MB_ERR_INVALID_CHARS,(LPCCH)name,-1,path+n,1024-n))return -3;
    file=CreateFileW(path,GENERIC_WRITE,0,0,CREATE_NEW,FILE_ATTRIBUTE_NORMAL,0);
    if(file==INVALID_HANDLE_VALUE)return (int)GetLastError();
    if(!WriteFile(file,data,size,&wrote,0)||wrote!=size||!FlushFileBuffers(file))result=-4;
    CloseHandle(file);if(result)DeleteFileW(path);return result;
}
#else
#include <time.h>
void halls_proof_time(unsigned char* out){
    time_t now=time(0);struct tm local;localtime_r(&now,&local);
    int64_t seconds=(int64_t)now;int32_t offset=(int32_t)(local.tm_gmtoff/60);
    memcpy(out,&seconds,8);memcpy(out+8,&offset,4);
}
/* Host verification adapter; excluded from Windows. Real player builds use CNG above.
   Kept deliberately inert until the organizer-side integration test supplies a signer. */
int halls_proof_sign(const unsigned char* p,uint32_t n,unsigned char* out){(void)p;(void)n;(void)out;return -2;}
int halls_proof_seal(const unsigned char* p,uint32_t n,uint32_t size,unsigned char* out){(void)p;(void)n;(void)size;(void)out;return -2;}
int halls_proof_write(const unsigned char* name,const unsigned char* p,uint32_t n){(void)name;(void)p;(void)n;return -2;}
#endif
