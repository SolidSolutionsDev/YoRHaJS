import React, {Component} from "react";
import {connect} from "react-redux";

import * as THREE from "three";
import {updateMainGameObject} from "../../stores/scene/actions";
import {AudioLoader} from "three";
import {OBJLoader} from "three/examples/jsm/loaders/OBJLoader";
import {MMDLoader} from "three/examples/jsm/loaders/MMDLoader";
import {FileLoader} from "three";

import "./Preloader.css";

class Preloader extends Component {

    manager = new THREE.LoadingManager();

    state = {
        loading: [],
        loaded: {},
    };

    load = () => {

        this.manager.onStart = (url, itemsLoaded, itemsTotal) => {

            console.log('[LoaderManager] Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.');

        };

        this.manager.onProgress = (item, loaded, total) => {
            // this gets called after an object has been loaded
            this.setState({loading: [...this.state.loading, item]});
            console.log("[LoaderManager] loaded item:", item, loaded, total);
        };

        this.manager.onLoad = () => {
            // everything is loaded
            // call your other function
            //
            this.setState({ready:true});
            alert("[LoaderManager] loaded");
            console.log("[LoaderManager] loaded", this);
        };

        this.manager.onError = (url) => {

            alert('[LoaderManager] There was an error loading ' + url);

        };
        this.initHandlers();

        Object.keys(this.props.assets).forEach(assetTag => {
            const assetFileURL = this.props.assets[assetTag];
            console.log(assetTag, assetFileURL);
            const currentLoader = this.manager.getHandler(this.props.assets[assetTag]);
            currentLoader.load(assetFileURL, (loadedAsset) => {
                this.setState(
                    {
                        loaded: {
                            ...this.state.loaded,
                            [assetTag]: loadedAsset
                        }
                    })
            });
        });
    };

    initHandlers() {
        this.manager.addHandler(/\.pmx$/i, new MMDLoader(this.manager));
        this.manager.addHandler(/\.mp3$/i, new AudioLoader(this.manager));
        this.manager.addHandler(/\.glsl$/i, new FileLoader(this.manager));
        this.manager.addHandler(/\.obj$/i, new OBJLoader(this.manager));
        this.manager.addHandler(/\.wav$/i, new AudioLoader(this.manager));
    }

    componentDidMount() {
        this.load();
    }

    render() {
        const {assetsLoadState, assets} = this.props;
        const {ready} = this.state;
        if (!assetsLoadState) {
            return <div
                className={"preloader"}>
                Loading...
                {
                Object.keys(this.state.loaded).map((item,index)=>{
                return <div
                key={`preloader_${index}`}
                >
                {`${item}:`} <br/> {`${assets[item].toUpperCase()}`}
                </div>}
                )}
                {}
                {ready ? <button className="full" onClick={this.props.markAssetsAsLoaded}>Start</button>:null}
            </div>
        } else {
            return this.props.children;
        }
    }
}


const getAssetLoadState = state => {
    return state.mainReducer.game.assetsLoadState;
};

const mapStateToProps = (state, ownProps) => {
    return {
        assetsLoadState: getAssetLoadState(state),
        assets: state.mainReducer.game.assets
    };
};

const mapDispatchToProps = dispatch => ({
    markAssetsAsLoaded: () => {
        dispatch(updateMainGameObject({assetsLoadState: true}));
    },
});

export default connect(mapStateToProps, mapDispatchToProps, null, {forwardRef: true})(
    Preloader
);