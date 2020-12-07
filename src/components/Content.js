import React from 'react';
import { Image } from 'react-bootstrap';

class Content extends React.Component {

    state = {
        contentType: null,
        embedLink: null
    }

    componentDidMount = () => {
        let newContentType = null;
        let newEmbedLink = null;

        if (
            this.props.link.endsWith('.jpg') || this.props.link.endsWith('.jpeg') || this.props.link.endsWith('.png') ||
            this.props.link.endsWith('.gif') || this.props.link.endsWith('.webp')
        ) {
            newContentType = 'directPicture';
        }

        if (
            this.props.link.endsWith('.mp4') || this.props.link.endsWith('.webm')
        ) {
            newContentType = 'directVideo';
        }

        if (this.props.link.startsWith('https://www.youtube.com/watch?v=')) {
            newContentType = 'youtube';
            newEmbedLink = this.props.link.replace('https://www.youtube.com/watch?v=', 'https://www.youtube-nocookie.com/embed/');
        }

        if (this.props.link.startsWith('https://vimeo.com/')) {
            newContentType = 'vimeo';
            newEmbedLink = this.props.link.replace('https://vimeo.com/', 'https://player.vimeo.com/video/');
        }

        this.setState({
            contentType: newContentType,
            embedLink: newEmbedLink
        });
    }

    contentDirectPicture = () => {
        return <Image className="mb-4" width="50%" src={this.props.link} fluid rounded />
    }

    contentDirectVideo = () => {
        return <video className="rounded mb-3" width="50%" src={this.props.link} controls />
    }

    contentYoutube = () => {
        return (
            <iframe className="rounded mb-3" title="youtube-embed" width="50%" height="300px" src={this.state.embedLink} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        )
    }

    contentVimeo = () => {
        return (
            <iframe className="rounded mb-3" title="vimeo-embed" width="50%" height="300px" src={this.state.embedLink} frameBorder="0" scrolling="no" allowFullScreen></iframe>
        )
    }

    content = () => {
        switch(this.state.contentType) {
            case 'directPicture':
                return this.contentDirectPicture();
            case 'directVideo':
                return this.contentDirectVideo();
            case 'youtube':
                return this.contentYoutube();
            case 'vimeo':
                return this.contentVimeo();
            default:
                return null;
        }
    }

    render() {
        return (
            <div>
                <this.content />
            </div>
        )
    }

}

export default Content;
