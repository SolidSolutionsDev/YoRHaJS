import React from "react";
import {playerStats, sphereOptions} from "../../../../solid-solutions-backend/constants/states";
import {cloneDeep,isEqual} from "lodash";
import * as THREE from "three";
import PropTypes from "prop-types";
import {instantiateFromPrefab, updateGameObject, updateGameObjectComponent} from "../../../../stores/scene/actions";
import * as _ from "lodash";
import {ColorSphereLogic} from "../ColorSphereLogic/ColorSphereLogic";

export class ColorPokemonLogic extends React.Component {
    childrenColorSpheres = [];
    pokemonInitialStats;
    color;
    startingColor;
    pokemonBattleLogic;

    start = () => {
        const {playerNumber, gameObject, meshComponentName, updateSelf} = this.props; // this.sphereMeshComponent = gameObject.getComponent(meshComponentName);
        // this.sphereMesh = this.sphereMeshComponent.mesh;
        this.pokemonInitialStats = cloneDeep(playerStats[playerNumber - 1]);
        this.pokemonInitialStats.color = cloneDeep(this.pokemonInitialStats.initColor);
        this.initReferences();
        updateSelf(this.pokemonInitialStats);
        // this.updateGameObjectAndComponents();
    }

    initReferences = () => {
        const {parent, opponentId, id} = this.props;
        this.pokemonBattleLogic = parent.getComponent("ColorGameBattleLogic");
        console.log(this.props.parent,this.props.opponentId,this);
        this.pokemonOpponent = parent.getChildGameObjectByTag(opponentId).getComponent(id);
        this.service = this.pokemonBattleLogic.service.onTransition(current => {
            console.log("ColorPokemonLogic transition", current);
            this.setState({current, activePlayer: current.context.player});
        });
    }

    componentDidMount() {


    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // console.log(prevProps.selfSettings,this.props.selfSettings);
        if (isEqual(prevProps.selfSettings,this.props.selfSettings)){
            return;
        }
        this.updateGameObjectAndComponents();
    }

    updateGameObjectAndComponents = () => {
        const {availableComponent, gameObject, meshComponentNames,playerNumber} = this.props;
        const {scene} =availableComponent;
        if (!this.props.color) {
            return;
        }
        const componentsToUpdate = meshComponentNames.reduce((acc, siblingComponent) => {
            return {
                ...acc,
                [siblingComponent]:
                    {
                        color: this.props.color,
                        playerNumber
                    }
            }
        }, {})
        scene.enqueueAction(
            updateGameObject(gameObject.id, {
                transform: {
                    position: this.props.position,
                    rotation: this.props.rotation,
                    //scale: this.pokemonInitialStats.scale
                },
                components: {
                    ...componentsToUpdate
                }
            })
        );
    }

    // TODO: pass to ColorPokemonLogic
    attackByType = {
        "absorb": (attack) => {
            const {colorAttachementPrefab, availableComponent, gameObject} = this.props;
            const {scene} = availableComponent;
            const currentColorAttachementPrefabId = _.uniqueId(colorAttachementPrefab);
            scene.enqueueAction(
                instantiateFromPrefab(
                    colorAttachementPrefab,
                    currentColorAttachementPrefabId,
                    null,
                    gameObject.id,
                    null,
                    {
                        ColorSphereLogic:
                            {color:attack.damage}
                            },
                )
            );
            this.pokemonOpponent.removeColor(attack.damage);
        },
        "recharge": (attack) => {
            const childGameObjectsIds = this.props.gameObject.childGameObjects;
            const {availableComponent} = this.props;
            const {scene} = availableComponent;
            childGameObjectsIds
                .forEach(
                    (
                        childGameObject
                    ) => {
                        const childGameObjectsId = childGameObject.id;
                        const size = childGameObject.getComponent("ColorSphereLogic").props.size;
                        // const initialScale = size ? size : 1;
                        scene.enqueueAction(
                            updateGameObjectComponent(
                                childGameObjectsId,
                                "ColorSphereLogic",
                                 {
                                     size: size + 0.2
                                    ,
                                }
                    )
                            );}
                        );
                    },
        "discharge": (attack) => {
            const childGameObjectsIds = this.props.gameObject.childGameObjects.map(gameObject=>gameObject.id);
            const { opponentId, gameObject, availableComponent } = this.props;
            const { scene } = availableComponent;
            console.log(childGameObjectsIds,this.props.opponentId);
            // scene.enqueueAction(
            //     updateGameObject(gameObject.id, {
            //         children: [],
            //     })
            // );
            // scene.enqueueAction(
            //     updateGameObject(opponentId ,{
            //         children: childGameObjectsIds,
            //     })
            // );
            // updateGameObject()
            // childGameObjects
            //     .map(childGameObject=>childGameObject.id)
            //     .forEach()
            // pokemon
            //     .childrenObjects
            //     .forEach(
            //         (
            //             children
            //         ) => (
            //             children
            //                 .state
            //                 .attacking = true
            //         )
            //     )
            // ;
        },
        // // TODO: understand what is this
        // "unknown": (attack) => {
        //     pokemon.opponent.addColor(attack.damage);
        // }

    }

   removeColor = (_colorDamage) => {
       const {color, updateSelf} = this.props;
        let colorDamage = {
            r: Math.floor(_colorDamage.r * sphereOptions.startingSize * 0.5),
            g: Math.floor(_colorDamage.g * sphereOptions.startingSize * 0.5),
            b: Math.floor(_colorDamage.b * sphereOptions.startingSize * 0.5),
        };
        console.log(color,colorDamage);
       updateSelf({
           color: {
            r: Math.max(color.r - colorDamage.r , 0),
            g: Math.max(color.g - colorDamage.g , 0),
            b: Math.max(color.b - colorDamage.b , 0),
        }});

    };

    addColor = (colorDamage) => {
        const {color, updateSelf} = this.props;
        updateSelf({
            color: {
                r: Math.min(color.r + colorDamage.r , 255),
                g: Math.min(color.g + colorDamage.g , 255),
                b: Math.min(color.b + colorDamage.b , 255),
            }
        });
    }
}

ColorPokemonLogic.propTypes = {
    playerNumber: PropTypes.number.isRequired,
    meshComponentNames: PropTypes.array.isRequired,
    opponentId: PropTypes.string.isRequired,
    colorAttachementPrefab: PropTypes.string.isRequired,
};
