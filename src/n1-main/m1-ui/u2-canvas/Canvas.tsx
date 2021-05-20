import React, {useEffect, useRef, useState} from 'react'
import bg from './bg.jpg'

const height = 800
const width = 1300
const buf = document.createElement('canvas')
buf.height = height
buf.width = width
const bufCtx = buf.getContext('2d')

const Canvas = () => {
    // ctx
    const ref = useRef<HTMLCanvasElement | null>(null)
    const [ctx, setCtx] = useState<CanvasRenderingContext2D>()
    useEffect(() => {
        if (!ctx && ref.current) {
            const g = ref.current.getContext('2d')
            g && setCtx(g)
        }
    }, [ref, ctx, setCtx])

    // bg
    const [isFR, setFR] = useState(true)
    const [bgImg, setBgImg] = useState<HTMLImageElement>()
    useEffect(() => {
        if (isFR) {
            const imgBG = new Image()
            imgBG.onload = () => {
                setBgImg(imgBG)
            }
            imgBG.src = bg

            setFR(false)
        }
    }, [isFR, setFR, setBgImg])

    // render bg
    const [isBG, setBG] = useState(false)
    useEffect(() => {
        if (!isBG && bgImg && ctx && bufCtx) {
            bufCtx.drawImage(bgImg, 0, 0)

            ctx.drawImage(buf, 0, 0)

            setBG(true)
        }
    }, [isBG, setBG, bgImg, ctx])

    // rerender
    const [re, setRe] = useState(false)
    const [ready, setReady] = useState<'ready' | 'rendered' | 'rendering' | 'creating'>('rendered')
    const [fps, setFps] = useState({step: 0, renders: 0, fps: 0})
    const [frame, setFrame] = useState<HTMLCanvasElement>()
    useEffect(() => {
        if (ctx && isBG && buf && !re) {

            setTimeout(() => {
                if (ready === 'ready' && frame) {
                    setTimeout(() => {
                        ctx.drawImage(frame, 0, 0)
                        // console.log('+')
                        setReady('rendered')
                    }, 0)

                    setReady('rendering')
                } else if (ready === 'rendered') {
                    setTimeout(() => {
                        // setFrame(getFrame(buf, setReady))
                        setFrame(buf)
                        // console.log('-')
                        setReady('ready')
                    }, 0)

                    setReady('creating')
                }

                setFps(x => {
                    let step = x.step
                    let fps = x.fps
                    let renders = x.renders + (ready === 'rendered' ? 1 : 0)

                    if (step + 1000 < Date.now()) {
                        step = Date.now()
                        // console.log('fps:', renders)
                        fps = renders
                        renders = 0
                    }

                    return {step, renders, fps}
                })

                setRe(false)
            }, 7)

            setRe(true)
        }
    }, [re, setRe, ctx, isBG, ready, setReady, fps, setFps, frame, setFrame])

    return (
        <div>
            <canvas width={width} height={height} ref={ref}/>
            fps: {fps.fps}
        </div>
    )
}

export default Canvas
