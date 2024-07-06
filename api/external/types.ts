export type InitialStateResponse = {
    aid: number;
    bvid: string;
    p: number;
    episode: string;
    videoData: {
        bvid: string;
        aid: number;
        videos: number;
        tid: number;
        tname: string;
        copyright: number;
        pic: string;
        title: string;
        pubdate: number;
        ctime: number;
        desc: string;
        desc_v2: {
            raw_text: string;
            type: number;
            biz_id: number;
        }[];
        state: number;
        duration: number;
        rights: {
            bp: number;
            elec: number;
            download: number;
            movie: number;
            pay: number;
            hd5: number;
            no_reprint: number;
            autoplay: number;
            ugc_pay: number;
            is_cooperation: number;
            ugc_pay_preview: number;
            no_background: number;
            clean_mode: number;
            is_stein_gate: number;
            is_360: number;
            no_share: number;
            arc_pay: number;
            free_watch: number;
        };
        owner: {
            mid: number;
            name: string;
            face: string;
        };
        stat: {
            aid: number;
            view: number;
            danmaku: number;
            reply: number;
            favorite: number;
            coin: number;
            share: number;
            now_rank: number;
            his_rank: number;
            like: number;
            dislike: number;
            evaluation: string;
            argue_msg: string;
            viewseo: number;
        };
        dynamic: string;
        cid: number;
        dimension: {
            width: number;
            height: number;
            rotate: number;
        };
        premiere: any;
        teenage_mode: number;
        is_chargeable_season: boolean;
        is_story: boolean;
        is_upower_exclusive: boolean;
        is_upower_play: boolean;
        no_cache: boolean;
        pages: {
            cid: number;
            page: number;
            from: string;
            part: string;
            duration: number;
            vid: string;
            weblink: string;
            dimension: {
                width: number;
                height: number;
                rotate: number;
            };
        }[];
        subtitle: {
            allow_submit: boolean;
            list: any[];
        };
        is_season_display: boolean;
        user_garb: {
            url_image_ani_cut: string;
        };
        honor_reply: {
            honor: {
                aid: number;
                type: number;
                desc: string;
                weekly_recommend_num: number;
            }[];
        };
        like_icon: string;
        need_jump_bv: boolean;
        embedPlayer: {
            p: number;
            aid: number;
            bvid: string;
            cid: number;
            vid: string;
            vtype: string;
            stats: {
                spmId: string;
                spmIdFrom: string;
            };
            t: number;
            fromDid: any;
            featureList: object;
        };
    };
    upData: {
        mid: string;
        name: string;
        approve: boolean;
        sex: string;
        rank: string;
        face: string;
        face_nft: number;
        face_nft_type: number;
        DisplayRank: string;
        regtime: number;
        spacesta: number;
        birthday: string;
        place: string;
        description: string;
        article: number;
        attentions: any[];
        fans: number;
        friend: number;
        attention: number;
        sign: string;
        level_info: {
            current_level: number;
            current_min: number;
            current_exp: number;
            next_exp: number;
        };
        pendant: {
            pid: number;
            name: string;
            image: string;
            expire: number;
            image_enhance: string;
            image_enhance_frame: string;
        };
        nameplate: {
            nid: number;
            name: string;
            image: string;
            image_small: string;
            level: string;
            condition: string;
        };
        Official: {
            role: number;
            title: string;
            desc: string;
            type: number;
        };
        official_verify: {
            type: number;
            desc: string;
        };
        vip: {
            type: number;
            status: number;
            due_date: number;
            vip_pay_type: number;
            theme_type: number;
            label: {
                path: string;
                text: string;
                label_theme: string;
                text_color: string;
                bg_style: number;
                bg_color: string;
                border_color: string;
                use_img_label: boolean;
                img_label_uri_hans: string;
                img_label_uri_hant: string;
                img_label_uri_hans_static: string;
                img_label_uri_hant_static: string;
            };
            avatar_subscript: number;
            nickname_color: string;
            role: number;
            avatar_subscript_url: string;
            tv_vip_status: number;
            tv_vip_pay_type: number;
            tv_due_date: number;
            vipType: number;
            vipStatus: number;
        };
        is_senior_member: number;
        archiveCount: number;
    };
};

export type WebPlayInfo = {
    code: number;
    message: string;
    ttl: number;
    data: {
        from: string;
        result: string;
        message: string;
        quality: number;
        format: string;
        timelength: number;
        accept_format: string;
        accept_description: string[];
        accept_quality: number[];
        video_codecid: number;
        seek_param: string;
        seek_type: string;
        dash: {
            duration: number;
            minBufferTime: number;
            min_buffer_time: number;
            video: {
                id: number;
                baseUrl: string;
                base_url: string;
                backupUrl: string[];
                backup_url: string[];
                bandwidth: number;
                mimeType: string;
                mime_type: string;
                codecs: string;
                width: number;
                height: number;
                frameRate: string;
                frame_rate: string;
                sar: string;
                startWithSap: number;
                start_with_sap: number;
                SegmentBase: {
                    Initialization: string;
                    indexRange: string;
                };
                segment_base: {
                    initialization: string;
                    index_range: string;
                };
                codecid: number;
            }[];
            audio: {
                id: number;
                baseUrl: string;
                base_url: string;
                backupUrl: string[];
                backup_url: string[];
                bandwidth: number;
                mimeType: string;
                mime_type: string;
                codecs: string;
                width: number;
                height: number;
                frameRate: string;
                frame_rate: string;
                sar: string;
                startWithSap: number;
                start_with_sap: number;
                SegmentBase: {
                    Initialization: string;
                    indexRange: string;
                };
                segment_base: {
                    initialization: string;
                    index_range: string;
                };
                codecid: number;
            }[];
            dolby: {
                type: number;
                audio: any;
            };
            flac: any;
        };
        support_formats: {
            quality: number;
            format: string;
            new_description: string;
            display_desc: string;
            superscript: string;
            codecs: string[];
        }[];
        high_format: any;
        volume: {
            measured_i: number;
            measured_lra: number;
            measured_tp: number;
            measured_threshold: number;
            target_offset: number;
            target_i: number;
            target_tp: number;
        };
        last_play_time: number;
        last_play_cid: number;
    };
    session: string;
};
