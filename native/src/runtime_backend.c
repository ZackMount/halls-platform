/* Narrow hosted services; the game itself uses core + alloc, never Rust std. */
#include <stddef.h>
#include <stdint.h>
#include <stdlib.h>
void halls_term_close(void);
int halls_write(int,const unsigned char*,size_t);
#ifdef _WIN32
#define WIN32_LEAN_AND_MEAN
#include <windows.h>
int _fltused = 0;
void* halls_alloc(size_t n,size_t alignment){alignment=alignment<sizeof(void*)?sizeof(void*):alignment;
    if(n>SIZE_MAX-alignment)return NULL;
    void* base=HeapAlloc(GetProcessHeap(),0,n+alignment);
    if(!base)return NULL;
    uintptr_t aligned=((uintptr_t)base+alignment)&~(alignment-1);
    ((void**)aligned)[-1]=base;return (void*)aligned;}
void halls_free(void* p){if(p)HeapFree(GetProcessHeap(),0,((void**)p)[-1]);}
uint64_t halls_clock(void){LARGE_INTEGER now,hz;QueryPerformanceCounter(&now);QueryPerformanceFrequency(&hz);return (uint64_t)now.QuadPart/hz.QuadPart*1000000000u+(uint64_t)now.QuadPart%hz.QuadPart*1000000000u/hz.QuadPart;}
void halls_sleep(uint64_t ns){Sleep((DWORD)((ns+999999)/1000000));}
#else
#include <time.h>
#include <errno.h>
void* halls_alloc(size_t n,size_t alignment){void* p=NULL;return posix_memalign(&p,alignment<sizeof(void*)?sizeof(void*):alignment,n)?NULL:p;}
void halls_free(void* p){free(p);}
uint64_t halls_clock(void){struct timespec t;clock_gettime(CLOCK_MONOTONIC,&t);return (uint64_t)t.tv_sec*1000000000u+t.tv_nsec;}
void halls_sleep(uint64_t ns){struct timespec t={ns/1000000000u,ns%1000000000u};while(nanosleep(&t,&t)<0 && errno==EINTR){}}
#endif
_Noreturn void halls_exit(int code){
    /* Cheap best effort restoration even on panic/OOM; no formatting/unwinder. */
    halls_term_close();
    static const unsigned char restore[]="\x1b[?2004l\x1b[?1004l\x1b[?25h\x1b[?1049l\x1b[0m";
    halls_write(1,restore,sizeof(restore)-1);
#ifdef _WIN32
    ExitProcess(code);
#else
    exit(code);
#endif
}
