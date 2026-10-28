/* Organizer model only: no proof writer or client signing material. */
#include <stdint.h>
#include <stddef.h>
#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
#include <bcrypt.h>
int halls_random(uint64_t* value){return BCryptGenRandom(0,(PUCHAR)value,sizeof(*value),BCRYPT_USE_SYSTEM_PREFERRED_RNG)<0?-1:0;}
#elif defined(__APPLE__)
#include <stdlib.h>
int halls_random(uint64_t* value){arc4random_buf(value,sizeof(*value));return 0;}
#else
#include <sys/random.h>
#include <errno.h>
int halls_random(uint64_t* value){unsigned char* p=(unsigned char*)value;size_t left=sizeof(*value);while(left){ssize_t n=getrandom(p,left,0);if(n<0){if(errno==EINTR)continue;return -1;}if(!n)return -1;p+=n;left-=n;}return 0;}
#endif
