import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { Button, Icon, Link } from '../components'
import logo2 from '../img/logo2.svg'

import telegram from '../img/Telegram.svg'
import facebook from '../img/Facebook.svg'
import twitter from '../img/Twitter.svg'
import github from '../img/Github.svg'
import reddit from '../img/Reddit.svg'
import medium from '../img/Medium.svg'

import './footer.css'

interface FooterProps {
    isDesktop: boolean,
    widthDesktop: number,
    isMobile: boolean
}

export const FooterBlock: React.FC<FooterProps> = (props: FooterProps) => {
    const [ firstRender, setFirstRender ] = React.useState<boolean>(false)

    const history = useNavigate()

    useEffect(() => {
        if (!firstRender) {
            setFirstRender(true)
        }
    }, [])

    return (
        <div className="footer">
            <div className="footer-in" style={{ width: props.widthDesktop }}>

                <div className="navigate" style={props.isMobile ? { flexDirection: 'column' } : {}}>
                    <div className="footer-logo">
                        <img src={logo2} onClick={() => history('/')} />

                    </div>

                    <div className="footer-menu" style={props.isMobile ? { flexDirection: 'column' } : {}}>
                        <div className="link-block">
                            <h3>Product</h3>

                            <Link onClick={() => history('/boards')}>Boards</Link>
                            <Link >How to play</Link>
                            <Link >Create board</Link>
                        </div>

                        <div className="link-block">
                            <h3>Support</h3>

                            <Link >How to play</Link>
                            {/* <Link >What is Everscale</Link> */}
                            {/* <Link >Get EVER</Link> */}
                            <Link >FAQ</Link>

                        </div>

                    </div>

                    <div className="buttons">
                        {/* <Button stretched type="outline" size="m">Install EVER Wallet</Button> */}
                        <Button stretched type="outline" size="m">Source code on GitHub</Button>

                    </div>

                </div>

                <div className="hr">

                </div>

                <div className="terms">
                    <div>
                        <span>© Mazekine, 2023</span>
                        <Link >
                        Terms of use
                        </Link>
                        <Link >
                        Privacy policy
                        </Link>
                        <Link >
                        Cookies
                        </Link>
                    </div>

                    <div>
                        <Link >
                            <Icon src={telegram} size={20} />
                        </Link>
                        <Link >
                            <Icon src={facebook} size={20} />
                        </Link>
                        <Link >
                            <Icon src={twitter} size={20} />
                        </Link>
                        <Link >
                            <Icon src={github} size={20} />
                        </Link>
                        <Link >
                            <Icon src={reddit} size={20} />
                        </Link>
                        <Link >
                            <Icon src={medium} size={20} />
                        </Link>
                    </div>
                </div>

            </div>

        </div>
    )
}
