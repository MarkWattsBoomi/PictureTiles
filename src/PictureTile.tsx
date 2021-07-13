import React, { CSSProperties } from 'react';
import PictureTileItem from './PictureTileItem';
import PictureTiles from './PictureTiles';
import { eDebugLevel } from './GUIHelpers';

export default class PictureTile extends React.Component<any, any> {
    context: any;
    canvas: any;
    contextMenu: any;

    msgboxVisible: boolean = false;
    msgboxTitle: string = '';
    msgboxButtons: any = [];
    msgboxContent: any;
    msgboxOnClose: any;

    dialogVisible: boolean = false;
    dialogTitle: string = '';
    dialogButtons: any = [];
    dialogContent: any;
    dialogOnClose: any;
    dialogForm: any;

    expanded: boolean = false;
    
    constructor(props: any) {
        super(props);
        this.showMore = this.showMore.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentDidUpdate() {
        
    }

    componentDidMount() {
        const root: PictureTiles = this.props.root;
        this.forceUpdate();
    }
    
    
    showMore(e: any) {
        e.stopPropagation();
        const root: PictureTiles = this.props.root;
        const tile: PictureTileItem = root.tileItemList.get(this.props.tileId); 
        let link: string = tile.link;
        if(!link.startsWith("http")) {
            if(root.getAttribute("BaseLinkUri")) {
                link = root.getAttribute("BaseLinkUri") + "/" + link;
            }
            else {
                link = "https://files-manywho-com.s3.amazonaws.com/" + root.tenantId + "/" + link;
            }
        }
        window.open(link,"_new");
    }

    onClick(e: any) {
        e.stopPropagation();
        const root: PictureTiles = this.props.root;
        root.doOutcome("onClick",this.props.tileId);
    }

    declutter(src: string) : string {
        let result: string = src;

        result = result.toLowerCase();
        while(result.indexOf(" ") >= 0) {
            result = result.replace(" ","");
        }
        result = result.replace("-","");
        result = result.replace("_","")
        return result;
    }

    render() {
        
        let content: any;
        let icon: any;

        let buttons: Array<any> = [];
        const root: PictureTiles = this.props.root;
        const tile: PictureTileItem = root.tileItemList.get(this.props.tileId); 

        

        let label: string = tile.title;
        if(root.debugLevel >= eDebugLevel.info) {
            label += " (" + tile.id + ")";
        }

        let style: CSSProperties = {};

       
        let logo: any;
        let logoFile: string = tile.logoUri;
        if(!logoFile.startsWith("http")) {
            if(root.getAttribute("BaseLogoUri")) {
                logoFile = root.getAttribute("BaseLogoUri") + "/" + logoFile;
            }
            else {
                logoFile = "https://files-manywho-com.s3.amazonaws.com/" + root.tenantId + "/" + logoFile;
            }
        } 
        

        if(root.getAttribute("HideLogo","false").toLowerCase() !== "true" ) {
            logo = (
                <img 
                    className="picturetile-logo-img"
                    src={logoFile}
                    alt="image not found"
                    onError={(e: any) => {e.onError=null;console.log(e.target.src)}}
                />
            );
        }

        content = (
            <div
                className="picturetile-body"
            >
                <span
                    className="picturetile-body-label"
                >
                    {tile.text}
                </span>
            </div>
        );

        let footer: any;
        if((root.getAttribute("HideFooter","false").toLowerCase() !== "true") && tile.link.length > 0 ) {
            footer = (
                <div 
                    className = "picturetile-footer"
                >
                    <span
                        className="picturetile-footer-label"
                        onClick={this.showMore}
                    >
                        {root.getAttribute("ButtonLabel","Read More")}
                    </span>
                </div>
            );
        }               
        
        return( 
            <div
                className={"picturetile "}
                style={style}
                title={tile.title}
                onContextMenu={(e: any) => {e.preventDefault()}}
                onClick={this.onClick}
            >
                <div 
                    className = "picturetile-logo"
                >
                    <div 
                        className = "picturetile-logo-inner"
                    >
                        {logo}
                    </div>
                </div>
                <div 
                    className = "picturetile-title"
                >
                    <div
                        className="picturetile-title-text"
                    >
                        <span
                            className="picturetile-title-text-label"
                        >
                            {tile.title}
                        </span>
                    </div>
                </div> 
                <div 
                    className = "picturetile-body"
                >
                    {content}
                </div>               
                {footer}
            </div>
        );
    }
}
