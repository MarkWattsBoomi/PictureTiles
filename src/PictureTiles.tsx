import React, { CSSProperties } from 'react';

import { modalDialogButton, eLoadingState, FlowComponent,  FlowObjectData,  FlowOutcome, ePageActionBindingType,  FlowMessageBox, FlowDialogBox } from 'flow-component-model';
import './PictureTiles.css';
import './MessageBox.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft, faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import PictureTileItem from './PictureTileItem';
import PictureTile from './PictureTile';
import { eDebugLevel } from './GUIHelpers';
import FlowContextMenu from 'flow-component-model/lib/Dialogs/FlowContextMenu';


//declare const manywho: IManywho;
declare const manywho: any;


export default class PictureTiles extends FlowComponent {
    version: string="1.0.0";
    context: any;
    debugLevel: eDebugLevel = eDebugLevel.error;

    selectedTiles: Array<string> = [];
    tileElements: Array<any> = [];
    tileElementPages: Array<any> = [];
    tileItemList: Map<string,PictureTileItem> = new Map();
    tileComponents: Map<string,PictureTile> = new Map();

    messageBox: FlowMessageBox;
    dialogBox: FlowDialogBox;

    contextMenu: FlowContextMenu;

    lastContent: any = (<div></div>);

    searchBox: HTMLInputElement;

    maxResults: number = 30;

    currentPage: number = 1;

       
    

    constructor(props: any) {
        super(props);
               
        this.flowMoved = this.flowMoved.bind(this);
        this.doOutcome = this.doOutcome.bind(this);

        this.searchKeyEvent = this.searchKeyEvent.bind(this);

        this.nextPage = this.nextPage.bind(this);
        this.previousPage = this.previousPage.bind(this);

        let dbl: number = parseInt(this.getAttribute("DebugLevel","0"));
              this.debugLevel = dbl || eDebugLevel.error ;
        this.debug("Debug Level = " + this.debugLevel, eDebugLevel.info);

        this.maxResults = parseInt(this.getAttribute("MaxSearchResults","30"));
    
    }

    setTile(key: string, element: PictureTile) {
        if(element) {
            this.tileComponents.set(key,element);
        }
        else {
            if(this.tileComponents.has(key)) {
                this.tileComponents.delete(key);
            }
        }
    }

    debug(message: string, debugLevel: eDebugLevel) {
        if(debugLevel.valueOf() <= this.debugLevel.valueOf()) {
            console.log(message);
        }
    }

    async flowMoved(xhr: any, request: any) {
        let me: any = this;
        if(xhr.invokeType==="FORWARD") {
            if(this.loadingState !== eLoadingState.ready){
                window.setTimeout(function() {me.flowMoved(xhr, request)},500);
            }
            else {
                this.buildTilesFromModel(this.model.dataSource.items,0);
                const state: any = this.getStateValue();
                //this.selectedNodeId = state?.properties["ITEM_ID"]?.value as number;
                this.forceUpdate();
            }
        }
        
    }

    async componentDidMount() {
        //will get this from a component attribute
        await super.componentDidMount();
        
        // build tree
        this.buildTilesFromModel(this.model.dataSource.items,0);

        (manywho as any).eventManager.addDoneListener(this.flowMoved, this.componentId);
        //(manywho as any).eventManager.addJoinListener(this.flowMoved, this.componentId);

        this.forceUpdate();
    }

    async componentWillUnmount() {
        await super.componentWillUnmount();
        (manywho as any).eventManager.removeDoneListener(this.componentId);
        //(manywho as any).eventManager.removeJoinListener(this.componentId);
        this.debug("unmount tiles", eDebugLevel.verbose);
    }

    setSearchBox(element: HTMLInputElement) {
        if(element){
            this.searchBox = element;
            this.searchBox.addEventListener("keyup",this.searchKeyEvent);
        }
        else {
            if(this.searchBox) {
                this.searchBox.removeEventListener("keyup",this.searchKeyEvent);
            }
        }
    }

    searchKeyEvent(event: KeyboardEvent) {
        if(event.key.toLowerCase()==="enter") {
            //this.filterTree();
        }
    }

   

    async doOutcome(outcomeName: string, tileId: string) {

        const tile: PictureTileItem = this.tileItemList.get(tileId); 
        if(this.outcomes[outcomeName]?.pageActionBindingType !== ePageActionBindingType.NoSave && tile ) 
        {
            await this.setStateValue(tile.objectData);
        }
        if(this.outcomes[outcomeName]) {
            await this.triggerOutcome(outcomeName);
        }
    }
    

    ///////////////////////////////////////////////////////////////////////////////////////////
    // constructs the nodeTree and a flat a map of TreeViewItems from the model datasource data
    ///////////////////////////////////////////////////////////////////////////////////////////
    buildTilesFromModel(items : FlowObjectData[], level: number){
        this.tileItemList = new Map();
        
        items.forEach((item: FlowObjectData) => {
            //construct TreeViewItem
            
            let tile: PictureTileItem = new PictureTileItem();
            tile.id = item.internalId;
            tile.title = item.properties[this.getAttribute("TitleAttribute")]?.value as string || "Undefined";  
            tile.text = item.properties[this.getAttribute("ContentAttribute")]?.value as string || "Undefined";
            tile.logoUri = item.properties[this.getAttribute("LogoAttribute")]?.value as string || "Undefined";
            tile.link = item.properties[this.getAttribute("LinkAttribute")]?.value as string || "";
            tile.objectData = item;

            //add to flat tree for easy searching
            //exclude if attribute
            if(this.getAttribute("RequiresLink","false").toLowerCase() === "true") {
                if(tile.link && tile.link.length > 0) {
                    this.tileItemList.set(tile.id,tile);
                }
            }
            else {
                this.tileItemList.set(tile.id,tile);
            }
            
            
        });

        this.tileItemList = new Map(Array.from(this.tileItemList).sort((a: any,b: any) => {
            switch(true) {
                case a[1].title > b[1].title:
                    return 1;
                case a[1].title === b[1].title:
                    return 0;
                default: 
                    return -1;

            }
        }));
        this.buildTiles();
    }
   
    //////////////////////////////////////////////////////////////
    // Constructs a tile array
    //////////////////////////////////////////////////////////////
    buildTiles() {
        let elements: Array<any> = [];
        this.tileElementPages = [];

        let maxItems: number = parseInt(this.getAttribute("MaxItemsPerPage","6"));

        if(this.tileItemList) {
            this.tileItemList.forEach((tile: PictureTileItem) => {
                elements.push(
                    <PictureTile 
                        key={tile.id}
                        root={this}
                        tileId={tile.id}
                        ref={(element: PictureTile) => {this.setTile(tile.id ,element)}}
                        
                    />
                );
                if(elements.length>=maxItems) {
                    this.tileElementPages.push(elements);
                    elements = [];
                }
            });
            //now add any remaining
            if(elements.length > 0) {
                this.tileElementPages.push(elements);
                elements = [];
            }
        }
    }

    

    showContextMenu(e: any) {
        e.preventDefault();
        e.stopPropagation();
        let listItems: Map<string , any> = new Map();
        if(this.contextMenu) {
            Object.keys(this.outcomes).forEach((key: string) => {
                const outcome: FlowOutcome = this.outcomes[key];
                if (outcome.isBulkAction === true && outcome.developerName !== "OnSelect" && outcome.developerName.toLowerCase().startsWith("cm")) {
                    listItems.set(outcome.developerName,(
                        <li 
                            className="cm-item"
                            title={outcome.label || key}
                            onClick={(e: any) => {e.stopPropagation(); this.doOutcome(key, undefined)}}
                        >
                            <span
                                className={"glyphicon glyphicon-" + (outcome.attributes["icon"]?.value || "plus") + " cm-item-icon"} />
                            <span
                                className={"cm-item-label"}
                            >
                                {outcome.label || key}
                            </span>
                        </li>
                    ));
                }
            });
            this.contextMenu.showContextMenu(e.clientX, e.clientY,listItems);   
            this.forceUpdate();
        }
    }

    async hideContextMenu() {
        this.contextMenu.hideContextMenu();
    }
    
    nextPage() {
        if(this.currentPage < this.tileElementPages.length) {
            this.currentPage += 1;
            this.forceUpdate();
        }
    }

    previousPage() {
        if(this.currentPage >1 ) {
            this.currentPage -= 1;
            this.forceUpdate();
        }
    }

    render() {
        
        if(this.loadingState !== eLoadingState.ready) {
            return this.lastContent;
        }
        

        //handle classes attribute and hidden and size
        let classes: string = "picturetiles " + this.getAttribute("classes","");
        let style: CSSProperties = {};
        style.width="-webkit-fill-available";
        style.height="-webkit-fill-available";

        if(this.model.visible === false) {
            style.display = "none";
        }
        if(this.model.width) {
            style.width=this.model.width + "px"
        }
        if(this.model.height) {
            style.height=this.model.height + "px"
        }

        let paginationBar: any;
        if(this.tileElementPages.length > 1) {

            let prev: any = (
                    <FontAwesomeIcon
                        className="picturetiles-pagination-bar-button"
                        icon={faArrowAltCircleLeft}
                        onClick={this.previousPage}
                    />
            );
            
            let next: any = (
                    <FontAwesomeIcon
                        className="picturetiles-pagination-bar-button"
                        icon={faArrowAltCircleRight}
                        onClick={this.nextPage}
                    />
            );
            
            let label: any = (
                <span
                    className="picturetiles-pagination-bar-label"
                >
                    {this.currentPage + "/" + this.tileElementPages.length}
                </span>
            );

            paginationBar = (
                <div
                    className = "picturetiles-pagination-bar"
                >
                    <div
                        className = "picturetiles-pagination-bar-buttons"
                    >
                        {prev}
                        {label}
                        {next}
                    </div>
                </div>
            )
        }
              
        let title:  string = this.model.label || "";
        
        this.lastContent = (
            <div
                className={classes}
                style={style}
                onContextMenu={this.showContextMenu}
            >
                <FlowContextMenu
                    parent={this}
                    ref={(element: FlowContextMenu) => {this.contextMenu = element}}
                />
                <FlowDialogBox
                    parent={this}
                    ref={(element: FlowDialogBox) => {this.dialogBox = element}}
                />
                <FlowMessageBox
                    parent={this}
                    ref={(element: FlowMessageBox) => {this.messageBox = element}}
                />
                <div
                    className="picturetiles-body"
                >
                    {this.tileElementPages[this.currentPage - 1]}
                </div>
                {paginationBar}
            </div>
            
        );
        return this.lastContent;
    }


}

manywho.component.register('PictureTiles', PictureTiles);