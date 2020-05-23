import React from "react";
import "./SimpleRPGIntro.css"

export class SimpleRPGIntro extends React.Component {

    state = {
        init:false,
    };
        componentDidMount() {

        }

        update = () => {
            if (this.state.init){
                return;
            }
            const {availableService} = this.props;
            const {stateMachine} = availableService;
            console.log(availableService);
            const {game} = stateMachine.stateMachines;
            game.service.onTransition(current => {
                console.log("transition", current);
                this.setState({active:current.value==="intro", data:current.context.constants.intro, init:true});
            });
            console.log("here",this.state.init);
            document.addEventListener("shoot_keydown", ()=> {
                console.log("here",this.state.active);
                if (this.state.active) { game.service.send("START") }
            });
        }


    render() {
           if (!this.state.init){
               return null;
           }
           return <div id="rpgIntro" className={this.state.active ? "" : "inactive" }>intro
               <h1 className={"rpgIntro-subTitle"}>{this.state.data.title}</h1><h2>{this.state.data.subTitle}</h2></div>;
    }
}

SimpleRPGIntro.propTypes = {
};
