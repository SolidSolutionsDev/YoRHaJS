import React from "react";
import {playerStats, sphereOptions} from "../../../../solid-solutions-backend/constants/states";
import {cloneDeep,isEqual} from "lodash";
import * as THREE from "three";
import PropTypes from "prop-types";
import {updateGameObject} from "../../../../stores/scene/actions";

export class ColorPokemonLogic extends React.Component {
    childrenColorSpheres = [];
    pokemonInitialStats;
    color;
    startingColor;

    start = () => {
        const {playerNumber, gameObject, meshComponentName, updateSelf} = this.props;
        // this.sphereMeshComponent = gameObject.getComponent(meshComponentName);
        // this.sphereMesh = this.sphereMeshComponent.mesh;
        this.pokemonInitialStats = cloneDeep(playerStats[playerNumber - 1]);
        this.pokemonInitialStats.color = cloneDeep(this.pokemonInitialStats.initColor);
        updateSelf(this.pokemonInitialStats);
        // this.updateGameObjectAndComponents();
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


   removeColor = (_colorDamage) => {
       const {color, updateSelf} = this.props;
        let colorDamage = {
            r: Math.floor(_colorDamage.r * sphereOptions.startingSize * 0.5),
            g: Math.floor(_colorDamage.g * sphereOptions.startingSize * 0.5),
            b: Math.floor(_colorDamage.b * sphereOptions.startingSize * 0.5),
        };

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
};
