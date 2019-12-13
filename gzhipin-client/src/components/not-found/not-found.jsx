/**
 * 这个路由与redux无交互 不应该放到containers里面 规范问题
 */

import React, {Component} from 'react'
import {Button} from 'antd-mobile'

class NotFound extends Component{
    render() {
        return (
            <div>
                <div>
                    <h2> This page cannot be found </h2>

                    <Button type='primary'
                            onClick={() => this.props.history.replace('/')}
                    >Back to main page
                    </Button>
                </div>
            </div>
        )
    }
}

export default NotFound